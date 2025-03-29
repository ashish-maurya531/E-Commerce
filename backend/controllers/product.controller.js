const db = require('../config/database');
const { v4: uuidv4 } = require('uuid');

const productController = {
  getAllProducts: async (req, res) => {
    try {
      const [products] = await db.query(`
        SELECT 
          p.product_id,
          p.name,
          p.sku,
          p.description,
          p.category_id,
          p.image_url,
          p.status,
          p.created_at,
          p.updated_at,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'variant_id', pv.sno,
              'volume', pv.volume,
              'pack_size', pv.pack_size,
              'price', pv.price,
              'original_price', pv.original_price,
              'stock', pv.stock,
              'min_stock', pv.min_stock,
              'discount', pv.discount_percentage
            )
          ) as variants
        FROM products p
        LEFT JOIN product_variants pv ON p.product_id = pv.product_id
        GROUP BY p.product_id
      `);
      
      // Process variants
      const processed = products.map(product => ({
        ...product,
        variants: product.variants[0].variant_id ? product.variants : []
      }));
      
      res.json(processed);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  getProductById: async (req, res) => {
    try {
      const [product] = await db.query(`
        SELECT 
          p.*,
          JSON_ARRAYAGG(
            JSON_OBJECT(
              'variant_id', pv.sno,
              'volume', pv.volume,
              'pack_size', pv.pack_size,
              'price', pv.price,
              'original_price', pv.original_price,
              'stock', pv.stock,
              'min_stock', pv.min_stock,
              'discount', pv.discount_percentage
            )
          ) as variants
        FROM products p
        LEFT JOIN product_variants pv ON p.product_id = pv.product_id
        WHERE p.product_id = ?
        GROUP BY p.product_id
      `, [req.params.id]);

      if (!product.length) {
        return res.status(404).json({ message: "Product not found" });
      }

      const result = {
        ...product[0],
        variants: product[0].variants[0].variant_id ? product[0].variants : []
      };

      res.json(result);
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  createProduct: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();

      const { 
        name,
        sku,
        description,
        category_id,
        variants = []
      } = req.body;
      console.log(name, sku, description, category_id, variants);

      const product_id = `PRD-${uuidv4().slice(0, 8)}`;
      const image_url = req.file ? `/uploads/products/${req.file.filename}` : null;

      // Create main product
      await connection.query(
        `INSERT INTO products (
          product_id, name, sku, description, category_id, image_url
        ) VALUES (?, ?, ?, ?, ?, ?)`,
        [product_id, name, sku, description, category_id, image_url]
      );

      // Create variants
      if (variants.length > 0) {
        for (const variant of variants) {
          await connection.query(
            `INSERT INTO product_variants (
              product_id, volume, pack_size, price, original_price, stock, min_stock
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              product_id,
              variant.volume,
              variant.pack_size || 1,
              variant.price,
              variant.original_price || variant.price,
              variant.stock || 0,
              variant.min_stock || 10
            ]
          );
        }
      }

      await connection.commit();
      res.status(201).json({
        message: "Product created successfully",
        product_id,
        variants
      });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      connection.release();
    }
  },

  updateProduct: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const { product_id } = req.params;

      const {
        name,
        sku,
        description,
        category_id,
        image_url,
        variants = []
      } = req.body;

      // Update main product
      await connection.query(
        `UPDATE products SET
          name = ?, sku = ?, description = ?, category_id = ?, image_url = ?
        WHERE product_id = ?`,
        [name, sku, description, category_id, image_url, product_id]
      );

      // Delete existing variants
      await connection.query(
        `DELETE FROM product_variants WHERE product_id = ?`,
        [product_id]
      );

      // Insert new variants
      if (variants.length > 0) {
        for (const variant of variants) {
          await connection.query(
            `INSERT INTO product_variants (
              product_id, volume, pack_size, price, original_price, stock, min_stock
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [
              product_id,
              variant.volume,
              variant.pack_size || 1,
              variant.price,
              variant.original_price || variant.price,
              variant.stock || 0,
              variant.min_stock || 10
            ]
          );
        }
      }

      await connection.commit();
      res.json({ message: "Product updated successfully" });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      connection.release();
    }
  },

  deleteProduct: async (req, res) => {
    const connection = await db.getConnection();
    try {
      await connection.beginTransaction();
      const { product_id } = req.params;

      await connection.query(
        `DELETE FROM products WHERE product_id = ?`,
        [product_id]
      );

      await connection.query(
        `DELETE FROM product_variants WHERE product_id = ?`,
        [product_id]
      );

      await connection.commit();
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      await connection.rollback();
      res.status(500).json({ message: "Server error", error: error.message });
    } finally {
      connection.release();
    }
  }
};

module.exports = productController;