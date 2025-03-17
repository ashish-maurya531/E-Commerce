import api from "./api"

// Get all orders
const getAllOrders = async (params) => {
  const response = await api.get("/orders", { params })
  return response.data
}

// Get a single order by ID
const getOrderById = async (id) => {
  const response = await api.get(`/orders/${id}`)
  return response.data
}

// Create a new order
const createOrder = async (orderData) => {
  const response = await api.post("/orders", orderData)
  return response.data
}

// Update order status
const updateOrderStatus = async (id, status) => {
  const response = await api.put(`/orders/${id}/status`, { status })
  return response.data
}

// Cancel an order
const cancelOrder = async (id) => {
  const response = await api.put(`/orders/${id}/cancel`)
  return response.data
}

// Get order history for a user
const getUserOrderHistory = async () => {
  const response = await api.get("/orders/user/history")
  return response.data
}

const orderService = {
  getAllOrders,
  getOrderById,
  createOrder,
  updateOrderStatus,
  cancelOrder,
  getUserOrderHistory,
}

export default orderService

