const { products } = require("../data/products")
const { categories } = require("../data/categories")

// Get all products
const getAllProducts = (req, res) => {
  try {
    // Filter products based on query parameters
    let filteredProducts = [...products]

    // Filter by category
    if (req.query.category) {
      const category = categories.find((c) => c.name.toLowerCase() === req.query.category.toLowerCase())
      if (category) {
        filteredProducts = filteredProducts.filter((product) => product.category_id === category.id)
      }
    }

    // Filter by status
    if (req.query.status) {
      filteredProducts = filteredProducts.filter(
        (product) => product.status.toLowerCase() === req.query.status.toLowerCase(),
      )
    }

    // Filter by price range
    if (req.query.minPrice) {
      filteredProducts = filteredProducts.filter((product) => product.price >= Number.parseInt(req.query.minPrice))
    }

    if (req.query.maxPrice) {
      filteredProducts = filteredProducts.filter((product) => product.price <= Number.parseInt(req.query.maxPrice))
    }

    // Search by name
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase()
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.name.toLowerCase().includes(searchTerm) || product.description.toLowerCase().includes(searchTerm),
      )
    }

    // Add category name to each product
    const productsWithCategory = filteredProducts.map((product) => {
      const category = categories.find((c) => c.id === product.category_id)
      return {
        ...product,
        category: category ? category.name : "Unknown",
      }
    })

    res.status(200).json(productsWithCategory)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get a single product by ID
const getProductById = (req, res) => {
  try {
    const { id } = req.params

    // Find product
    const product = products.find((product) => product.id === Number.parseInt(id))
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Add category name
    const category = categories.find((c) => c.id === product.category_id)

    res.status(200).json({
      ...product,
      category: category ? category.name : "Unknown",
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create a new product
const createProduct = (req, res) => {
  try {
    const { name, description, category_id, price, stock, minStock, manufacturer, dosage, batchNumber, expiryDate } =
      req.body

    // Check if category exists
    const categoryExists = categories.some((c) => c.id === Number.parseInt(category_id))
    if (!categoryExists) {
      return res.status(400).json({ message: "Invalid category" })
    }

    // Create new product
    const newProduct = {
      id: products.length + 1,
      name,
      sku: `SKU-${Date.now()}`,
      description,
      category_id: Number.parseInt(category_id),
      price: Number.parseFloat(price),
      stock: Number.parseInt(stock),
      minStock: Number.parseInt(minStock),
      manufacturer,
      dosage,
      batchNumber,
      expiryDate,
      image: req.file ? `/uploads/products/${req.file.filename}` : null,
      franchiser_id: req.user.role === "franchiser" ? req.user.id : null,
      status:
        Number.parseInt(stock) > 0
          ? Number.parseInt(stock) <= Number.parseInt(minStock)
            ? "Low Stock"
            : "Active"
          : "Out of Stock",
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add product to the array (in a real app, this would be a database insert)
    products.push(newProduct)

    // Add category name
    const category = categories.find((c) => c.id === newProduct.category_id)

    res.status(201).json({
      message: "Product created successfully",
      product: {
        ...newProduct,
        category: category ? category.name : "Unknown",
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update a product
const updateProduct = (req, res) => {
  try {
    const { id } = req.params
    const {
      name,
      description,
      category_id,
      price,
      stock,
      minStock,
      manufacturer,
      dosage,
      batchNumber,
      expiryDate,
      status,
    } = req.body

    // Find product
    const productIndex = products.findIndex((product) => product.id === Number.parseInt(id))
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Check if category exists
    if (category_id) {
      const categoryExists = categories.some((c) => c.id === Number.parseInt(category_id))
      if (!categoryExists) {
        return res.status(400).json({ message: "Invalid category" })
      }
    }

    // Update product
    const updatedProduct = {
      ...products[productIndex],
      name: name || products[productIndex].name,
      description: description || products[productIndex].description,
      category_id: category_id ? Number.parseInt(category_id) : products[productIndex].category_id,
      price: price ? Number.parseFloat(price) : products[productIndex].price,
      stock: stock ? Number.parseInt(stock) : products[productIndex].stock,
      minStock: minStock ? Number.parseInt(minStock) : products[productIndex].minStock,
      manufacturer: manufacturer || products[productIndex].manufacturer,
      dosage: dosage || products[productIndex].dosage,
      batchNumber: batchNumber || products[productIndex].batchNumber,
      expiryDate: expiryDate || products[productIndex].expiryDate,
      image: req.file ? `/uploads/products/${req.file.filename}` : products[productIndex].image,
      status:
        status ||
        (Number.parseInt(stock || products[productIndex].stock) > 0
          ? Number.parseInt(stock || products[productIndex].stock) <=
            Number.parseInt(minStock || products[productIndex].minStock)
            ? "Low Stock"
            : "Active"
          : "Out of Stock"),
      updatedAt: new Date().toISOString(),
    }

    // Update product in the array
    products[productIndex] = updatedProduct

    // Add category name
    const category = categories.find((c) => c.id === updatedProduct.category_id)

    res.status(200).json({
      message: "Product updated successfully",
      product: {
        ...updatedProduct,
        category: category ? category.name : "Unknown",
      },
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Delete a product
const deleteProduct = (req, res) => {
  try {
    const { id } = req.params

    // Find product
    const productIndex = products.findIndex((product) => product.id === Number.parseInt(id))
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Remove product from the array
    products.splice(productIndex, 1)

    res.status(200).json({ message: "Product deleted successfully" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}

