const db = require('../config/database');

const productController = {
  // Get all products
  getAllProducts: async (req, res) => {
    try {
      const [products] = await db.query(`
        SELECT p.*, c.category_name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.category_id
        ORDER BY p.sno DESC
      `);
      
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
      const [product] = await db.query(`
        SELECT p.*, c.category_name as category_name 
        FROM products p 
        LEFT JOIN categories c ON p.category_id = c.category_id 
        WHERE p.product_id = ?
      `, [req.params.id]);

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
      const data = req.body;
      
      // Generate unique product ID if not provided
      if (!data.product_id) {
        data.product_id = `PRO-${Math.random().toString(36).substr(2, 8)}`;
      }

      // Handle JSON fields - ensure proper JSON stringification
      const jsonFields = {
        benefits: Array.isArray(data.benefits) ? data.benefits : JSON.parse(data.benefits || '[]'),
        features: Array.isArray(data.features) ? data.features : JSON.parse(data.features || '[]'),
        specifications: Array.isArray(data.specifications) ? data.specifications : JSON.parse(data.specifications || '[]'),
        related_products: Array.isArray(data.related_products) ? data.related_products : JSON.parse(data.related_products || '[]')
      };

      // Convert JSON fields to strings for database storage
      const processedData = {
        ...data,
        benefits: JSON.stringify(jsonFields.benefits),
        features: JSON.stringify(jsonFields.features),
        specifications: JSON.stringify(jsonFields.specifications),
        related_products: JSON.stringify(jsonFields.related_products),
        // Handle images array
        images: JSON.stringify(req.files ? req.files.map(f => `/uploads/products/${f.filename}`) : [])
      };

      // Remove any undefined or null values
      Object.keys(processedData).forEach(key => {
        if (processedData[key] === undefined || processedData[key] === null) {
          delete processedData[key];
        }
      });

      // Create SQL query with properly processed data
      const [result] = await db.query(
        'INSERT INTO products SET ?',
        processedData
      );

      // Update category product count if needed
      if (processedData.category_id) {
        await db.query(
          'UPDATE categories SET category_products_count = category_products_count + 1 WHERE category_id = ?',
          [processedData.category_id]
        );
      }

      res.status(201).json({
        message: "Product created successfully",
        product_id: processedData.product_id,
        result
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
      const data = req.body;

      await db.query('START TRANSACTION');

      // Get current product data
      const [currentProduct] = await db.query(
        'SELECT * FROM products WHERE product_id = ?', 
        [id]
      );

      if (!currentProduct.length) {
        await db.query('ROLLBACK');
        return res.status(404).json({ message: "Product not found" });
      }

      const current = currentProduct[0];

      // Handle images first
      let currentImages;
      try {
        currentImages = JSON.parse(current.images || '[]');
      } catch (e) {
        currentImages = [];
      }

      let newImages = [];
      if (req.files && req.files.length > 0) {
        newImages = req.files.map(f => `/uploads/products/${f.filename}`);
      }

      // Handle existing images from form data
      let existingImages = [];
      if (data.existing_images) {
        try {
          existingImages = JSON.parse(data.existing_images);
        } catch (e) {
          existingImages = currentImages;
        }
      } else {
        existingImages = currentImages;
      }

      // Combine all images
      const allImages = [...existingImages, ...newImages];

      // Create update data object
      const updateData = {
        name: data.name !== undefined ? data.name : current.name,
        category_id: data.category_id !== undefined ? data.category_id : current.category_id,
        sku: data.sku !== undefined ? data.sku : current.sku,
        description_en: data.description_en !== undefined ? data.description_en : current.description_en,
        description_hi: data.description_hi !== undefined ? data.description_hi : current.description_hi,
        short_description_en: data.short_description_en !== undefined ? data.short_description_en : current.short_description_en,
        short_description_hi: data.short_description_hi !== undefined ? data.short_description_hi : current.short_description_hi,
        dosage_en: data.dosage_en !== undefined ? data.dosage_en : current.dosage_en,
        dosage_hi: data.dosage_hi !== undefined ? data.dosage_hi : current.dosage_hi,
        mrp: data.mrp !== undefined ? data.mrp : current.mrp,
        dp: data.dp !== undefined ? data.dp : current.dp,
        pv: data.pv !== undefined ? data.pv : current.pv,
        price: data.price !== undefined ? data.price : current.price,
        original_price: data.original_price !== undefined ? data.original_price : current.original_price,
        discount_percentage: data.discount_percentage !== undefined ? data.discount_percentage : current.discount_percentage,
        stock: data.stock !== undefined ? data.stock : current.stock,
        min_stock: data.min_stock !== undefined ? data.min_stock : current.min_stock,
        size: data.size !== undefined ? data.size : current.size,
        status: data.status !== undefined ? data.status : current.status,
        images: JSON.stringify(allImages)
      };

      // Handle JSON fields
      const jsonFields = ['benefits', 'features', 'specifications', 'related_products'];
      for (const field of jsonFields) {
        if (data[field]) {
          try {
            const parsedData = typeof data[field] === 'string' ? 
              JSON.parse(data[field]) : data[field];
            updateData[field] = JSON.stringify(parsedData);
          } catch (e) {
            updateData[field] = current[field]; // Keep existing value if parsing fails
          }
        } else {
          updateData[field] = current[field]; // Keep existing value if not provided
        }
      }

      // Handle category change
      if (data.category_id && data.category_id !== current.category_id) {
        await db.query(
          'UPDATE categories SET category_products_count = category_products_count - 1 WHERE category_id = ? AND category_products_count > 0',
          [current.category_id]
        );
        await db.query(
          'UPDATE categories SET category_products_count = category_products_count + 1 WHERE category_id = ?',
          [data.category_id]
        );
      }

      // Remove auto-generated fields
      delete updateData.sno;
      delete updateData.created_at;
      delete updateData.updated_at;

      // Perform update
      const [result] = await db.query(
        'UPDATE products SET ? WHERE product_id = ?',
        [updateData, id]
      );

      if (result.affectedRows === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ message: "Product not found" });
      }

      await db.query('COMMIT');

      res.json({ 
        message: "Product updated successfully",
        images: allImages
      });

    } catch (error) {
      await db.query('ROLLBACK');
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
      
      // First, get the category ID of the product to be deleted
      const [product] = await db.query(
        'SELECT category_id FROM products WHERE product_id = ?', 
        [id]
      );
      
      if (!product.length) {
        return res.status(404).json({ message: "Product not found" });
      }
      
      const categoryId = product[0].category_id;
      
      // Begin transaction
      await db.query('START TRANSACTION');
      
      // Delete the product
      const [result] = await db.query(
        'DELETE FROM products WHERE product_id = ?', 
        [id]
      );
      
      if (result.affectedRows === 0) {
        await db.query('ROLLBACK');
        return res.status(404).json({ message: "Product not found" });
      }
      
      // Decrement the product count in the category
      await db.query(
        'UPDATE categories SET category_products_count = category_products_count - 1 WHERE category_id = ? AND category_products_count > 0',
        [categoryId]
      );
      
      // Commit the transaction
      await db.query('COMMIT');
      
      res.json({ message: "Product deleted successfully" });
    } catch (error) {
      // Rollback in case of error
      await db.query('ROLLBACK');
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