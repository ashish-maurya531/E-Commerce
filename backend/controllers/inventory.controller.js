const db = require('../config/database');

const inventoryController = {
  getInventoryStatus: async (req, res) => {
    try {
      const [inventory] = await db.query(`
        SELECT 
          p.id,
          p.name,
          p.sku,
          p.stock,
          p.min_stock,
          c.name as category_name,
          CASE
            WHEN p.stock = 0 THEN 'Out of Stock'
            WHEN p.stock <= p.min_stock THEN 'Low Stock'
            ELSE 'In Stock'
          END as status
        FROM products p
        LEFT JOIN categories c ON p.category_id = c.id
        ORDER BY p.stock ASC
      `);
      res.json(inventory);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getInventoryTransactions: async (req, res) => {
    try {
      const [transactions] = await db.query(`
        SELECT 
          it.*,
          p.name as product_name,
          p.sku
        FROM inventory_transactions it
        JOIN products p ON it.product_id = p.id
        ORDER BY it.created_at DESC
      `);
      res.json(transactions);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  adjustInventory: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { product_id, type, quantity, notes } = req.body;
      const reference_id = `ADJ-${Date.now()}`;

      // Update product stock
      const stockAdjustment = type === 'IN' ? quantity : -quantity;
      await connection.query(
        `UPDATE products 
         SET stock = stock + ?
         WHERE id = ?`,
        [stockAdjustment, product_id]
      );

      // Record transaction
      await connection.query(
        `INSERT INTO inventory_transactions (
          product_id, type, quantity, reference_id, notes
        ) VALUES (?, ?, ?, ?, ?)`,
        [product_id, type, quantity, reference_id, notes]
      );

      await connection.commit();
      res.json({ 
        message: "Inventory adjusted successfully",
        reference_id
      });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      connection.release();
    }
  }
};

module.exports = inventoryController;

