const { products } = require("../data/products")
const { inventoryTransactions } = require("../data/inventory")

// Get inventory status
const getInventoryStatus = (req, res) => {
  try {
    // Calculate inventory statistics
    const totalProducts = products.length
    const inStockProducts = products.filter((item) => item.status === "Active").length
    const lowStockProducts = products.filter((item) => item.status === "Low Stock").length
    const outOfStockProducts = products.filter((item) => item.status === "Out of Stock").length

    // Get inventory items with additional info
    const inventoryItems = products.map((product) => ({
      id: product.id,
      name: product.name,
      sku: product.sku,
      category_id: product.category_id,
      stock: product.stock,
      minStock: product.minStock,
      supplier: product.manufacturer,
      lastUpdated: product.updatedAt,
      status: product.status,
    }))

    res.status(200).json({
      stats: {
        totalProducts,
        inStockProducts,
        lowStockProducts,
        outOfStockProducts,
      },
      inventory: inventoryItems,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get inventory history for a product
const getProductInventoryHistory = (req, res) => {
  try {
    const { productId } = req.params

    // Find product
    const product = products.find((product) => product.id === Number.parseInt(productId))
    if (!product) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Get inventory transactions for this product
    const history = inventoryTransactions.filter((transaction) => transaction.product_id === Number.parseInt(productId))

    res.status(200).json({
      product: {
        id: product.id,
        name: product.name,
        sku: product.sku,
        currentStock: product.stock,
      },
      history,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Adjust inventory
const adjustInventory = (req, res) => {
  try {
    const { productId, adjustmentType, quantity, notes } = req.body

    // Validate input
    if (!productId || !adjustmentType || !quantity) {
      return res.status(400).json({
        message: "Product ID, adjustment type, and quantity are required",
      })
    }

    // Find product
    const productIndex = products.findIndex((product) => product.id === Number.parseInt(productId))
    if (productIndex === -1) {
      return res.status(404).json({ message: "Product not found" })
    }

    // Validate adjustment type
    if (adjustmentType !== "addition" && adjustmentType !== "subtraction") {
      return res.status(400).json({ message: "Invalid adjustment type" })
    }

    // Validate quantity
    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" })
    }

    // Check if there's enough stock for subtraction
    if (adjustmentType === "subtraction" && products[productIndex].stock < quantity) {
      return res.status(400).json({
        message: `Insufficient stock. Available: ${products[productIndex].stock}, Requested: ${quantity}`,
      })
    }

    // Update product stock
    if (adjustmentType === "addition") {
      products[productIndex].stock += quantity
    } else {
      products[productIndex].stock -= quantity
    }

    // Update product status based on new stock level
    if (products[productIndex].stock <= 0) {
      products[productIndex].status = "Out of Stock"
    } else if (products[productIndex].stock <= products[productIndex].minStock) {
      products[productIndex].status = "Low Stock"
    } else {
      products[productIndex].status = "Active"
    }

    // Update product's updatedAt timestamp
    products[productIndex].updatedAt = new Date().toISOString()

    // Record inventory transaction
    const newTransaction = {
      id: inventoryTransactions.length + 1,
      product_id: Number.parseInt(productId),
      user_id: req.user.id,
      transaction_type: adjustmentType === "addition" ? "Addition" : "Subtraction",
      quantity_change: quantity,
      transaction_date: new Date().toISOString().replace("T", " ").substring(0, 16),
      remarks: notes || (adjustmentType === "addition" ? "Stock addition" : "Stock removal"),
    }

    inventoryTransactions.push(newTransaction)

    res.status(200).json({
      message: "Inventory adjusted successfully",
      product: {
        id: products[productIndex].id,
        name: products[productIndex].name,
        sku: products[productIndex].sku,
        currentStock: products[productIndex].stock,
        status: products[productIndex].status,
      },
      transaction: newTransaction,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get low stock items
const getLowStockItems = (req, res) => {
  try {
    // Get low stock and out of stock products
    const lowStockItems = products.filter(
      (product) => product.status === "Low Stock" || product.status === "Out of Stock",
    )

    res.status(200).json(lowStockItems)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getInventoryStatus,
  getProductInventoryHistory,
  adjustInventory,
  getLowStockItems,
}

