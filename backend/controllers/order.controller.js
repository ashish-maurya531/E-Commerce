const { orders } = require("../data/orders")
const { products } = require("../data/products")
const { inventoryTransactions } = require("../data/inventory")

// Get all orders
const getAllOrders = (req, res) => {
  try {
    // Filter orders based on query parameters
    let filteredOrders = [...orders]

    // Filter by status
    if (req.query.status) {
      filteredOrders = filteredOrders.filter((order) => order.status.toLowerCase() === req.query.status.toLowerCase())
    }

    // Filter by date range
    if (req.query.startDate) {
      const startDate = new Date(req.query.startDate)
      filteredOrders = filteredOrders.filter((order) => new Date(order.createdAt) >= startDate)
    }

    if (req.query.endDate) {
      const endDate = new Date(req.query.endDate)
      filteredOrders = filteredOrders.filter((order) => new Date(order.createdAt) <= endDate)
    }

    // Filter by payment method
    if (req.query.payment) {
      filteredOrders = filteredOrders.filter((order) =>
        order.payment.toLowerCase().includes(req.query.payment.toLowerCase()),
      )
    }

    // Search by customer name or order ID
    if (req.query.search) {
      const searchTerm = req.query.search.toLowerCase()
      filteredOrders = filteredOrders.filter(
        (order) => order.customer.toLowerCase().includes(searchTerm) || order.id.toLowerCase().includes(searchTerm),
      )
    }

    res.status(200).json(filteredOrders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get a single order by ID
const getOrderById = (req, res) => {
  try {
    const { id } = req.params

    // Find order
    const order = orders.find((order) => order.id === id)
    if (!order) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user is authorized to view this order
    if (req.user.role === "customer" && order.user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to view this order" })
    }

    res.status(200).json(order)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Create a new order
const createOrder = (req, res) => {
  try {
    const { items, address, payment } = req.body

    // Validate items
    if (!items || !Array.isArray(items) || items.length === 0) {
      return res.status(400).json({ message: "Order must contain at least one item" })
    }

    // Check if products exist and have sufficient stock
    const orderItems = []
    let totalAmount = 0

    for (const item of items) {
      const product = products.find((p) => p.id === item.product_id)

      if (!product) {
        return res.status(400).json({ message: `Product with ID ${item.product_id} not found` })
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          message: `Insufficient stock for ${product.name}. Available: ${product.stock}, Requested: ${item.quantity}`,
        })
      }

      // Calculate item total
      const itemTotal = product.price * item.quantity
      totalAmount += itemTotal

      // Add to order items
      orderItems.push({
        id: orderItems.length + 1,
        product_id: product.id,
        name: product.name,
        price: product.price,
        quantity: item.quantity,
      })

      // Update product stock (in a real app, this would be a transaction)
      const productIndex = products.findIndex((p) => p.id === product.id)
      products[productIndex].stock -= item.quantity

      // Update product status based on new stock level
      if (products[productIndex].stock <= 0) {
        products[productIndex].status = "Out of Stock"
      } else if (products[productIndex].stock <= products[productIndex].minStock) {
        products[productIndex].status = "Low Stock"
      }

      // Record inventory transaction
      inventoryTransactions.push({
        id: inventoryTransactions.length + 1,
        product_id: product.id,
        user_id: req.user.id,
        transaction_type: "Subtraction",
        quantity_change: item.quantity,
        transaction_date: new Date().toISOString().replace("T", " ").substring(0, 16),
        remarks: "Order fulfillment",
      })
    }

    // Create new order
    const newOrder = {
      id: `ORD-${Date.now().toString().substring(7)}`,
      user_id: req.user.id,
      customer: `${req.user.firstName} ${req.user.lastName}`,
      email: req.user.email,
      phone: req.user.phone,
      address: address || req.user.address,
      date: new Date().toISOString().replace("T", " ").substring(0, 16),
      amount: totalAmount,
      payment,
      status: "Pending",
      items: orderItems,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    }

    // Add order to the array (in a real app, this would be a database insert)
    orders.push(newOrder)

    res.status(201).json({
      message: "Order created successfully",
      order: newOrder,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Update order status
const updateOrderStatus = (req, res) => {
  try {
    const { id } = req.params
    const { status } = req.body

    // Validate status
    const validStatuses = ["Pending", "Processing", "Shipped", "Delivered", "Cancelled"]
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" })
    }

    // Find order
    const orderIndex = orders.findIndex((order) => order.id === id)
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if order is already cancelled
    if (orders[orderIndex].status === "Cancelled") {
      return res.status(400).json({ message: "Cannot update a cancelled order" })
    }

    // Check if order is already delivered
    if (orders[orderIndex].status === "Delivered" && status !== "Delivered") {
      return res.status(400).json({ message: "Cannot update a delivered order" })
    }

    // If cancelling an order, restore product stock
    if (status === "Cancelled" && orders[orderIndex].status !== "Cancelled") {
      for (const item of orders[orderIndex].items) {
        const productIndex = products.findIndex((p) => p.id === item.product_id)
        if (productIndex !== -1) {
          // Restore stock
          products[productIndex].stock += item.quantity

          // Update product status based on new stock level
          if (products[productIndex].stock > 0) {
            products[productIndex].status =
              products[productIndex].stock <= products[productIndex].minStock ? "Low Stock" : "Active"
          }

          // Record inventory transaction
          inventoryTransactions.push({
            id: inventoryTransactions.length + 1,
            product_id: item.product_id,
            user_id: req.user.id,
            transaction_type: "Addition",
            quantity_change: item.quantity,
            transaction_date: new Date().toISOString().replace("T", " ").substring(0, 16),
            remarks: "Order cancellation",
          })
        }
      }
    }

    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      status,
      updatedAt: new Date().toISOString(),
    }

    res.status(200).json({
      message: "Order status updated successfully",
      order: orders[orderIndex],
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Cancel an order
const cancelOrder = (req, res) => {
  try {
    const { id } = req.params

    // Find order
    const orderIndex = orders.findIndex((order) => order.id === id)
    if (orderIndex === -1) {
      return res.status(404).json({ message: "Order not found" })
    }

    // Check if user is authorized to cancel this order
    if (req.user.role === "customer" && orders[orderIndex].user_id !== req.user.id) {
      return res.status(403).json({ message: "Not authorized to cancel this order" })
    }

    // Check if order is already cancelled
    if (orders[orderIndex].status === "Cancelled") {
      return res.status(400).json({ message: "Order is already cancelled" })
    }

    // Check if order is already delivered
    if (orders[orderIndex].status === "Delivered") {
      return res.status(400).json({ message: "Cannot cancel a delivered order" })
    }

    // Restore product stock
    for (const item of orders[orderIndex].items) {
      const productIndex = products.findIndex((p) => p.id === item.product_id)
      if (productIndex !== -1) {
        // Restore stock
        products[productIndex].stock += item.quantity

        // Update product status based on new stock level
        if (products[productIndex].stock > 0) {
          products[productIndex].status =
            products[productIndex].stock <= products[productIndex].minStock ? "Low Stock" : "Active"
        }

        // Record inventory transaction
        inventoryTransactions.push({
          id: inventoryTransactions.length + 1,
          product_id: item.product_id,
          user_id: req.user.id,
          transaction_type: "Addition",
          quantity_change: item.quantity,
          transaction_date: new Date().toISOString().replace("T", " ").substring(0, 16),
          remarks: "Order cancellation",
        })
      }
    }

    // Update order
    orders[orderIndex] = {
      ...orders[orderIndex],
      status: "Cancelled",
      updatedAt: new Date().toISOString(),
    }

    res.status(200).json({
      message: "Order cancelled successfully",
      order: orders[orderIndex],
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get order history for a user
const getUserOrderHistory = (req, res) => {
  try {
    // Filter orders for the current user
    const userOrders = orders.filter((order) => order.user_id === req.user.id)

    res.status(200).json(userOrders)
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getUserOrderHistory,
}

