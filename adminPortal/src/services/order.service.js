import api from './api'

const orderService = {
  getAllOrders: async () => {
    const response = await api.get('/orders')
    return response.data
  },

  getOrderById: async (id) => {
    const response = await api.get(`/orders/${id}`)
    return response.data
  },

  updateOrderStatus: async (orderId, status) => {
    const response = await api.put(`/orders/${orderId}/status`, { status })
    return response.data
  },

  cancelOrder: async (orderId) => {
    const response = await api.put(`/orders/${orderId}/cancel`)
    return response.data
  }
}

export default orderService

