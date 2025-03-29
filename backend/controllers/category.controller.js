const db = require('../config/database');
const { v4: uuidv4 } = require('uuid'); // Add UUID for generating category_id
const fs = require('fs');
const path = require('path');

const categoryController = {
  // Get all categories
  getAllCategories: async (req, res) => {
    try {
      const [categories] = await db.query(`
        SELECT 
          sno,
          category_id,
          category_name as name,
          category_description as description,
          category_image_url as image_url,
          category_products_count as products_count,
          category_created_at as created_at,
          category_updated_at as updated_at
        FROM categories 
        ORDER BY category_name
      `);
      res.json(categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Get category by ID
  getCategoryById: async (req, res) => {
    try {
      const { id } = req.params;
      const [category] = await db.query(`
        SELECT 
          sno,
          category_id,
          category_name as name,
          category_description as description,
          category_image_url as image_url,
          category_products_count as products_count,
          category_created_at as created_at,
          category_updated_at as updated_at
        FROM categories 
        WHERE category_id = ?
      `, [id]);
      
      if (!category.length) {
        return res.status(404).json({ message: "Category not found" });
      }

      // Get products in this category
      const [products] = await db.query('SELECT * FROM products WHERE category_id = ?', [id]);
      
      res.json({
        ...category[0],
        products
      });
    } catch (error) {
      console.error('Error fetching category:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  // Create category
  createCategory: async (req, res) => {
    try {
      const { name, description } = req.body;
      
      // Get image URL from uploaded file with updated path
      const image_url = req.file ? `/uploads/categories/${req.file.filename}` : null;
      const category_id = `CAT-${uuidv4().slice(0, 8)}`;

      // Check if category exists
      const [existing] = await db.query(
        'SELECT * FROM categories WHERE category_name = ?', 
        [name]
      );
      
      if (existing.length) {
        return res.status(400).json({ 
          message: "Category already exists" 
        });
      }

      // Insert category
      const [result] = await db.query(
        `INSERT INTO categories (
          category_id,
          category_name,
          category_description,
          category_image_url
        ) VALUES (?, ?, ?, ?)`,
        [
          category_id,
          name,
          description || '',
          image_url
        ]
      );

      console.log('Database insert result:', result);

      res.status(201).json({
        message: "Category created successfully",
        category: {
          sno: result.insertId,
          category_id,
          name,
          description: description || '',
          image_url
        }
      });
    } catch (error) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Error creating category:', error);
      res.status(500).json({ 
        message: "Server error", 
        error: error.message,
        stack: error.stack 
      });
    }
  },

  // Update category
  updateCategory: async (req, res) => {
    try {
      const { id } = req.params;
      const { name, description } = req.body;
  
      // Validate required fields
      if (!name) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ 
          message: "Category name is required" 
        });
      }
  
      // Get current category to check existing image
      const [currentCategory] = await db.query(
        'SELECT category_image_url FROM categories WHERE category_id = ?',
        [id]
      );
  
      if (!currentCategory.length) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(404).json({ 
          message: "Category not found" 
        });
      }
  
      // Check for duplicate name
      const [existing] = await db.query(
        'SELECT * FROM categories WHERE category_name = ? AND category_id != ?',
        [name, id]
      );
  
      if (existing.length) {
        if (req.file) {
          fs.unlinkSync(req.file.path);
        }
        return res.status(400).json({ 
          message: "Category name already exists" 
        });
      }
  
      // Handle image update
      let image_url = currentCategory[0].category_image_url;
      if (req.file) {
        // Delete old image if it exists
        if (currentCategory[0].category_image_url) {
          const oldImagePath = path.join(__dirname, '..', currentCategory[0].category_image_url);
          if (fs.existsSync(oldImagePath)) {
            fs.unlinkSync(oldImagePath);
          }
        }
        // Set new image URL
        image_url = `/uploads/categories/${req.file.filename}`;
      }
  
      // Update category
      const [result] = await db.query(
        `UPDATE categories 
         SET category_name = ?,
             category_description = ?,
             category_image_url = ?,
             category_updated_at = CURRENT_TIMESTAMP
         WHERE category_id = ?`,
        [name, description || '', image_url, id]
      );
  
      if (result.affectedRows === 0) {
        return res.status(404).json({ 
          message: "Category not found" 
        });
      }
  
      res.json({
        message: "Category updated successfully",
        category: {
          category_id: id,
          name,
          description: description || '',
          image_url
        }
      });
    } catch (error) {
      // Clean up uploaded file if error occurs
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      console.error('Error updating category:', error);
      res.status(500).json({ 
        message: "Server error", 
        error: error.message 
      });
    }
  },

  // Delete category
  deleteCategory: async (req, res) => {
    try {
      const { id } = req.params;

      // Get category details to find the image
      const [category] = await db.query(
        'SELECT category_image_url FROM categories WHERE category_id = ?',
        [id]
      );

      if (!category.length) {
        return res.status(404).json({ message: "Category not found" });
      }

      // // Check if category has products
      // const [products] = await db.query(
      //   'SELECT COUNT(*) as count FROM products WHERE category_id = ?', 
      //   [id]
      // );
      
      // if (products[0].count > 0) {
      //   return res.status(400).json({ message: "Cannot delete category with existing products" });
      // }

      // Delete the image file if it exists
      if (category[0].category_image_url) {
        const imagePath = path.join(__dirname, '..', category[0].category_image_url);
        if (fs.existsSync(imagePath)) {
          fs.unlinkSync(imagePath);
        }
      }

      // Delete the category from database
      const [result] = await db.query(
        'DELETE FROM categories WHERE category_id = ?',
        [id]
      );

      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Category not found" });
      }

      res.json({ message: "Category deleted successfully" });
    } catch (error) {
      console.error('Error deleting category:', error);
      res.status(500).json({ 
        message: "Server error", 
        error: error.message 
      });
    }
  }
}

module.exports = categoryController;

