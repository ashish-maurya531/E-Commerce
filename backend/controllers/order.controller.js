const db = require('../config/database');

const orderController = {
  getAllOrders: async (req, res) => {
    try {
      const [orders] = await db.query(`
        SELECT o.*, 
               CONCAT(u.firstname, ' ', u.lastname) as user_name 
        FROM orders o 
        LEFT JOIN usersdetails u ON o.user_id = u.id
        ORDER BY o.created_at DESC
      `);
      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
   
  getOrderById: async (req, res) => {
    try {
      const [order] = await db.query(`
        SELECT o.*, 
               CONCAT(u.firstname, ' ', u.lastname) as user_name,
               u.email as user_email,
               u.phoneno as user_phone
        FROM orders o
        LEFT JOIN usersdetails u ON o.user_id = u.id
        WHERE o.id = ?
      `, [req.params.id]);

      if (!order.length) {
        return res.status(404).json({ message: "Order not found" });
      }

      // Get order items with product details
      const [items] = await db.query(`
        SELECT oi.*, p.name as product_name, p.size, p.images
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
      `, [req.params.id]);

      order[0].items = items;
      res.json(order[0]);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getUserOrderHistory: async (req, res) => {
    try {
      const [orders] = await db.query(`
        SELECT o.*, 
               CONCAT(u.firstname, ' ', u.lastname) as user_name
        FROM orders o
        LEFT JOIN usersdetails u ON o.user_id = u.id
        WHERE o.user_id = ?
        ORDER BY o.created_at DESC
      `, [req.user.id]);

      // Get items for each order with product details
      for (let order of orders) {
        const [items] = await db.query(`
          SELECT oi.*, p.name as product_name, p.size, p.images
          FROM order_items oi
          LEFT JOIN products p ON oi.product_id = p.product_id
          WHERE oi.order_id = ?
        `, [order.id]);
        order.items = items;
      }

      res.json(orders);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  createOrder: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      
      const {
        user_id,
        customer_name,
        email,
        phone,
        address,
        payment_method,
        items // Now only need product_id and quantity from client
      } = req.body;

      // Validate user exists
      const [user] = await connection.query(
        'SELECT * FROM usersdetails WHERE id = ?',
        [user_id]
      );

      if (!user.length) {
        throw new Error('User not found');
      }

      // Calculate totals
      let total_mrp = 0;
      let total_dp = 0;
      let total_pv = 0;
      let total_amount = 0;
      
      // Store processed items with product details
      let processedItems = [];

      // Verify stock and calculate totals
      for (const item of items) {
        const [product] = await connection.query(
          'SELECT * FROM products WHERE product_id = ?',
          [item.product_id]
        );

        if (!product.length || product[0].stock < item.quantity) {
          throw new Error(`Insufficient stock for product ID ${item.product_id}`);
        }

        // Use product prices from database
        const productData = product[0];
        total_mrp += productData.mrp * item.quantity;
        total_dp += productData.dp * item.quantity;
        total_pv += productData.pv * item.quantity;
        total_amount += productData.price * item.quantity;

        // Store processed item with correct prices
        processedItems.push({
          product_id: item.product_id,
          quantity: item.quantity,
          mrp: productData.mrp,
          dp: productData.dp,
          pv: productData.pv,
          price: productData.price
        });
      }

      // Create order
      const orderId = `ORD-${Date.now()}`;
      await connection.query(
        `INSERT INTO orders SET ?`,
        {
          id: orderId,
          user_id,
          customer_name,
          email,
          phone,
          address,
          total_mrp,
          total_dp,
          total_pv,
          total_amount,
          payment_method,
          status: 'Pending',
          created_at: new Date(),
          updated_at: new Date()
        }
      );

      // Create order items and update stock using processed items
      for (const item of processedItems) {
        await connection.query(
          `INSERT INTO order_items SET ?`,
          {
            order_id: orderId,
            product_id: item.product_id,
            quantity: item.quantity,
            mrp: item.mrp,
            dp: item.dp,
            pv: item.pv,
            price: item.price
          }
        );

        // Update stock
        await connection.query(
          `UPDATE products SET stock = stock - ? WHERE product_id = ?`,
          [item.quantity, item.product_id]
        );
      }

      await connection.commit();

      // Fetch the complete order details for response
      const [orderDetails] = await connection.query(`
        SELECT o.*, 
               CONCAT(u.firstname, ' ', u.lastname) as user_name,
               u.email as user_email,
               u.phoneno as user_phone
        FROM orders o
        LEFT JOIN usersdetails u ON o.user_id = u.id
        WHERE o.id = ?
      `, [orderId]);

      // Fetch order items with product details
      const [orderItems] = await connection.query(`
        SELECT oi.*, p.name as product_name, p.size, p.images
        FROM order_items oi
        LEFT JOIN products p ON oi.product_id = p.product_id
        WHERE oi.order_id = ?
      `, [orderId]);

      orderDetails[0].items = orderItems;

      res.status(201).json(orderDetails[0]);
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      connection.release();
    }
  },

  updateOrderStatus: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { id } = req.params;
      const { status } = req.body;

      const [result] = await connection.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        [status, id]
      );

      if (result.affectedRows === 0) {
        throw new Error("Order not found");
      }

      await connection.commit();
      res.json({ message: "Order status updated successfully" });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      connection.release();
    }
  },

  cancelOrder: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { id } = req.params;

      // Get order items to restore stock
      const [items] = await connection.query(
        'SELECT * FROM order_items WHERE order_id = ?',
        [id]
      );

      // Restore stock for each item
      for (const item of items) {
        await connection.query(
          'UPDATE products SET stock = stock + ? WHERE product_id = ?',
          [item.quantity, item.product_id]
        );
      }

      // Update order status
      const [result] = await connection.query(
        'UPDATE orders SET status = ? WHERE id = ?',
        ['Cancelled', id]
      );

      if (result.affectedRows === 0) {
        throw new Error("Order not found");
      }

      await connection.commit();
      res.json({ message: "Order cancelled successfully" });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      connection.release();
    }
  }
};

module.exports = orderController;

