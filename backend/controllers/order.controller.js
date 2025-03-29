const db = require('../config/database');

const orderController = {
  getAllOrders: async (req, res) => {
    try {
      console.log('[DB] Fetching all orders');
      const [orders] = await db.query(`
        SELECT o.*, 
               COUNT(oi.id) as items_count,
               u.name as user_name
        FROM orders o
        LEFT JOIN order_items oi ON o.id = oi.order_id
        LEFT JOIN users u ON o.user_id = u.id
        GROUP BY o.id
        ORDER BY o.created_at DESC
      `);
      console.log(`[DB] Successfully fetched ${orders.length} orders`);
      res.json(orders);
    } catch (error) {
      console.error('[DB Error] Failed to fetch orders:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getOrderById: async (req, res) => {
    try {
      console.log(`[DB] Fetching order with ID: ${req.params.id}`);
      const [order] = await db.query(
        `SELECT * FROM orders WHERE id = ?`,
        [req.params.id]
      );

      if (!order.length) {
        console.log(`[DB] Order not found with ID: ${req.params.id}`);
        return res.status(404).json({ message: "Order not found" });
      }

      console.log(`[DB] Fetching items for order: ${req.params.id}`);
      const [items] = await db.query(
        `SELECT oi.*, p.name, p.sku
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ?`,
        [req.params.id]
      );

      console.log(`[DB] Successfully fetched order and ${items.length} items`);
      res.json({ ...order[0], items });
    } catch (error) {
      console.error('[DB Error] Failed to fetch order:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  createOrder: async (req, res) => {
    const connection = await db.getConnection();
    console.log('[DB] Starting order creation transaction');
    try {
      await connection.beginTransaction();

      const {
        user_id, customer_name, email, phone,
        address, payment_method, items
      } = req.body;

      // Calculate total amount
      let totalAmount = 0;
      for (const item of items) {
        console.log(`[DB] Checking stock for product ID: ${item.product_id}`);
        const [product] = await connection.query(
          'SELECT price, stock FROM products WHERE id = ?',
          [item.product_id]
        );

        if (!product.length || product[0].stock < item.quantity) {
          console.log(`[DB] Insufficient stock for product ID: ${item.product_id}`);
          throw new Error(`Insufficient stock for product ID ${item.product_id}`);
        }

        totalAmount += product[0].price * item.quantity;
      }

      // Create order
      const orderId = `ORD-${Date.now()}`;
      console.log(`[DB] Creating new order with ID: ${orderId}`);
      await connection.query(
        `INSERT INTO orders (
          id, user_id, customer_name, email, phone,
          address, amount, payment_method
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        [orderId, user_id, customer_name, email, phone,
         address, totalAmount, payment_method]
      );

      // Create order items and update inventory
      for (const item of items) {
        console.log(`[DB] Processing item: ${item.product_id}, Quantity: ${item.quantity}`);
        await connection.query(
          `INSERT INTO order_items (
            order_id, product_id, quantity, price
          ) VALUES (?, ?, ?, (
            SELECT price FROM products WHERE id = ?
          ))`,
          [orderId, item.product_id, item.quantity, item.product_id]
        );

        console.log(`[DB] Updating stock for product: ${item.product_id}`);
        await connection.query(
          `UPDATE products 
           SET stock = stock - ?
           WHERE id = ?`,
          [item.quantity, item.product_id]
        );

        console.log(`[DB] Recording inventory transaction for product: ${item.product_id}`);
        await connection.query(
          `INSERT INTO inventory_transactions (
            product_id, type, quantity, reference_id, notes
          ) VALUES (?, 'OUT', ?, ?, 'Order deduction')`,
          [item.product_id, item.quantity, orderId]
        );
      }

      await connection.commit();
      console.log(`[DB] Order creation completed successfully: ${orderId}`);
      res.status(201).json({
        message: "Order created successfully",
        orderId
      });
    } catch (error) {
      console.error('[DB Error] Order creation failed:', error);
      await connection.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      connection.release();
      console.log('[DB] Connection released');
    }
  },

  updateOrderStatus: async (req, res) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const [result] = await db.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Order not found" });
      }

      res.json({ message: "Order status updated successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  cancelOrder: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const userId = req.user.id; // From auth middleware

      // Check if order exists and belongs to user
      const [order] = await connection.query(
        'SELECT * FROM orders WHERE id = ? AND (user_id = ? OR ? = true)',
        [id, userId, req.user.role === 'admin']
      );

      if (!order.length) {
        return res.status(404).json({ message: "Order not found or unauthorized" });
      }

      if (order[0].status === 'Cancelled') {
        return res.status(400).json({ message: "Order is already cancelled" });
      }

      if (!['Pending', 'Processing'].includes(order[0].status)) {
        return res.status(400).json({ 
          message: "Cannot cancel order in current status" 
        });
      }

      // Get order items to restore stock
      const [items] = await connection.query(
        'SELECT product_id, quantity FROM order_items WHERE order_id = ?',
        [id]
      );

      // Restore stock for each item
      for (const item of items) {
        await connection.query(
          'UPDATE products SET stock = stock + ? WHERE id = ?',
          [item.quantity, item.product_id]
        );

        // Record inventory transaction
        await connection.query(
          `INSERT INTO inventory_transactions (
            product_id, type, quantity, reference_id, notes
          ) VALUES (?, 'IN', ?, ?, 'Order cancellation')`,
          [item.product_id, item.quantity, id]
        );
      }

      // Update order status
      await connection.query(
        'UPDATE orders SET status = "Cancelled", updated_at = CURRENT_TIMESTAMP WHERE id = ?',
        [id]
      );

      await connection.commit();
      res.json({ message: "Order cancelled successfully" });
    } catch (error) {
      await connection.rollback();
      console.error('Error cancelling order:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      connection.release();
    }
  },
};

module.exports = orderController;

