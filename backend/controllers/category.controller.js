const { categories } = require("../data/categories")
const { products } = require("../data/products")

// Get all categories
const getAllCategories = (req, res) => {
  try {
    res.status(200).json(categories)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get a single category by ID
const getCategoryById = (req, res) => {
  try {
    const { id } = req.params

    // Find category
    const category = categories.find((category) => category.id === Number.parseInt(id))
    if (!category) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Get products in this category
    const categoryProducts = products.filter((product) => product.category_id === category.id)

    res.status(200).json({
      ...category,
      products: categoryProducts,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create a new category
const createCategory = (req, res) => {
  try {
    const { name, description } = req.body

    // Check if category already exists
    const existingCategory = categories.find((category) => category.name.toLowerCase() === name.toLowerCase())

    if (existingCategory) {
      return res.status(400).json({ message: "Category already exists" })
    }

    // Create new category
    const newCategory = {
      id: categories.length + 1,
      name,
      description,
      createdAt: new Date().toISOString(),
    }

    // Add category to the array (in a real app, this would be a database insert)
    categories.push(newCategory)

    res.status(201).json({
      message: "Category created successfully",
      category: newCategory,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update a category
const updateCategory = (req, res) => {
  try {
    const { id } = req.params
    const { name, description } = req.body

    // Find category
    const categoryIndex = categories.findIndex((category) => category.id === Number.parseInt(id))
    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Check if name is already taken by another category
    if (name && name !== categories[categoryIndex].name) {
      const nameExists = categories.some(
        (category) => category.name.toLowerCase() === name.toLowerCase() && category.id !== Number.parseInt(id),
      )

      if (nameExists) {
        return res.status(400).json({ message: "Category name is already taken" })
      }
    }

    // Update category
    categories[categoryIndex] = {
      ...categories[categoryIndex],
      name: name || categories[categoryIndex].name,
      description: description || categories[categoryIndex].description,
    }

    res.status(200).json({
      message: "Category updated successfully",
      category: categories[categoryIndex],
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete a category
const deleteCategory = (req, res) => {
  try {
    const { id } = req.params

    // Find category
    const categoryIndex = categories.findIndex((category) => category.id === Number.parseInt(id))
    if (categoryIndex === -1) {
      return res.status(404).json({ message: "Category not found" })
    }

    // Check if category is in use
    const categoryInUse = products.some((product) => product.category_id === Number.parseInt(id))
    if (categoryInUse) {
      return res.status(400).json({
        message: "Cannot delete category because it is associated with products",
      })
    }

    // Remove category from the array
    categories.splice(categoryIndex, 1)

    res.status(200).json({ message: "Category deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}

