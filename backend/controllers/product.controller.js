const db = require('../config/database');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const [products] = await db.query('SELECT * FROM products');
      
      if (!products.length) {
        return res.status(404).json({ message: "No products found" });
      }
      res.json(products);
    } catch (error) {
      res.status(500).json({ message: "Error fetching products", error: error.message });
    }
  },

  // Get single product by ID
  getProductById: async (req, res) => {
    try {
      const [product] = await db.query('SELECT * FROM products WHERE product_id = ?', [req.params.id]);
      if (!product.length) {
        return res.status(404).json({ message: "Product not found" });
      }
      res.json(product[0]);
    } catch (error) {
      res.status(500).json({ message: "Error fetching product", error: error.message });
    }
  },

  // Add new methods
  createProduct: async (req, res) => {
    try {
      console.log('Received product data:', req.body);
      console.log('Received files:', req.files);
  
      // Handle image uploads
      let imageUrls = [];
      if (req.files && req.files.length > 0) {
        imageUrls = req.files.map(file => `/uploads/products/${file.filename}`);
      }
  
      // Validate required fields
      if (!req.body.name || !req.body.category_id) {
        return res.status(400).json({ message: "Product name and category are required" });
      }
  
      // Generate a unique product ID
      const uniqueId = Math.random().toString(16).substring(2, 10);
      const product_id = `PRO-${uniqueId}`;
  
      // Calculate discount percentage if not provided
      let discount_percentage = req.body.discount_percentage;
      if (!discount_percentage && req.body.original_price && req.body.price) {
        discount_percentage = Math.round(((req.body.original_price - req.body.price) / req.body.original_price) * 100);
      }
  
      // Prepare the data
      const productData = {
        product_id,
        category_id: req.body.category_id,
        name: req.body.name,
        sku: req.body.sku || null,
        description_en: req.body.description_en || null,
        description_hi: req.body.description_hi || null,
        short_description_en: req.body.short_description_en || null,
        short_description_hi: req.body.short_description_hi || null,
        benefits: req.body.benefits ? JSON.stringify(req.body.benefits) : '[]',
        dosage_en: req.body.dosage_en || null,
        dosage_hi: req.body.dosage_hi || null,
        mrp: req.body.mrp || 0,
        dp: req.body.dp || 0,
        pv: req.body.pv || 0,
        price: req.body.price || 0,
        original_price: req.body.original_price || null,
        discount_percentage: discount_percentage || 0,
        stock: req.body.stock || 0,
        min_stock: req.body.min_stock || 10,
        size: req.body.size || '',
        images: JSON.stringify(imageUrls),
        features: req.body.features ? JSON.stringify(req.body.features) : '[]',
        specifications: req.body.specifications ? JSON.stringify(req.body.specifications) : '[]',
        related_products: req.body.related_products ? JSON.stringify(req.body.related_products) : '[]',
        rating: 0,
        status: req.body.status || 'Active',
        created_at: new Date(),
        updated_at: new Date()
      };
  
      // Create placeholders and values array for the SQL query
      const fields = Object.keys(productData);
      const values = Object.values(productData);
      const placeholders = fields.map(() => '?').join(', ');
  
      const query = `
        INSERT INTO products (${fields.join(', ')})
        VALUES (${placeholders})
      `;
  
      const [result] = await db.query(query, values);
  
      res.status(201).json({ 
        message: "Product created successfully", 
        product_id: productData.product_id
      });
    } catch (error) {
      console.error('Create product error:', error);
      res.status(500).json({ 
        message: "Error creating product", 
        error: error.message 
      });
    }
  },

  updateProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const {
        name, sku, description_en, description_hi, short_description_en,
        short_description_hi, benefits, dosage_en, dosage_hi, mrp, dp,
        pv, price, original_price, stock, min_stock, size, status
      } = req.body;

      const [result] = await db.query(
        `UPDATE products SET
          name = ?, sku = ?, description_en = ?, description_hi = ?,
          short_description_en = ?, short_description_hi = ?, benefits = ?,
          dosage_en = ?, dosage_hi = ?, mrp = ?, dp = ?, pv = ?,
          price = ?, original_price = ?, stock = ?, min_stock = ?,
          size = ?, status = ?
        WHERE product_id = ?`,
        [
          name, sku, description_en, description_hi, short_description_en,
          short_description_hi, benefits, dosage_en, dosage_hi, mrp, dp,
          pv, price, original_price, stock, min_stock, size, status, id
        ]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product updated successfully" });
    } catch (error) {
      console.error('Update product error:', error);
      res.status(500).json({ 
        message: "Error updating product", 
        error: error.message 
      });
    }
  },

  deleteProduct: async (req, res) => {
    try {
      const { id } = req.params;
      const [result] = await db.query('DELETE FROM products WHERE product_id = ?', [id]);

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Product not found" });
      }

      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      console.error('Delete product error:', error);
      res.status(500).json({ 
        message: "Error deleting product", 
        error: error.message 
      });
    }
  },

  // Get product reviews
  getProductReviews: async (req, res) => {
    try {
      const [reviews] = await db.query(
        'SELECT * FROM reviews WHERE product_id = ? ORDER BY created_at DESC',
        [req.params.id]
      );
      res.json(reviews);
    } catch (error) {
      res.status(500).json({ message: "Error fetching reviews", error: error.message });
    }
  },

  // Add new review
  addReview: async (req, res) => {
    const { user_id, rating, comment, images } = req.body;
    try {
      const [result] = await db.query(
        'INSERT INTO reviews (product_id, user_id, rating, comment, images) VALUES (?, ?, ?, ?, ?)',
        [req.params.id, user_id, rating, comment, JSON.stringify(images)]
      );

      // Update product rating
      await updateProductRating(req.params.id);

      res.status(201).json({ message: "Review added successfully", review_id: result.insertId });
    } catch (error) {
      res.status(500).json({ message: "Error adding review", error: error.message });
    }
  }
};

// Helper function to update product rating
async function updateProductRating(productId) {
  try {
    const [reviews] = await db.query(
      'SELECT AVG(rating) as avg_rating FROM reviews WHERE product_id = ?',
      [productId]
    );
    
    await db.query(
      'UPDATE products SET rating = ? WHERE product_id = ?',
      [reviews[0].avg_rating || 0, productId]
    );
  } catch (error) {
    console.error('Error updating product rating:', error);
  }
}

module.exports = productController;