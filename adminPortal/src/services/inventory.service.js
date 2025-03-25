import api from './api'

const inventoryService = {
  getInventoryStatus: async () => {
    const response = await api.get('/inventory')
    return response.data
  },

  getProductInventoryHistory: async (productId) => {
    const response = await api.get(`/inventory/${productId}/history`)
    return response.data
  },

  adjustInventory: async (adjustmentData) => {
    const response = await api.post('/inventory/adjust', adjustmentData)
    return response.data
  },

  getLowStockItems: async () => {
    const response = await api.get('/inventory/low-stock')
    return response.data
  }
}

export default inventoryService

