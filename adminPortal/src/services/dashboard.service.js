import api from './api'

const dashboardService = {
  getStats: async () => {
    const response = await api.get('/dashboard/stats')
    return response.data
  },

  getSalesData: async () => {
    const response = await api.get('/dashboard/sales')
    return response.data
  },

  getCategoryDistribution: async () => {
    const response = await api.get('/dashboard/categories')
    return response.data
  },

  getTopProducts: async () => {
    const response = await api.get('/dashboard/top-products')
    return response.data
  },

  getRecentOrders: async () => {
    const response = await api.get('/dashboard/recent-orders')
    return response.data
  }
}

export default dashboardService

