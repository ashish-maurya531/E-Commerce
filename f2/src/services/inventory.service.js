import api from "./api"

// Get inventory status
const getInventoryStatus = async () => {
  const response = await api.get("/inventory")
  return response.data
}

// Get inventory history for a product
const getProductInventoryHistory = async (productId) => {
  const response = await api.get(`/inventory/${productId}/history`)
  return response.data
}

// Adjust inventory
const adjustInventory = async (adjustmentData) => {
  const response = await api.post("/inventory/adjust", adjustmentData)
  return response.data
}

// Get low stock items
const getLowStockItems = async () => {
  const response = await api.get("/inventory/low-stock")
  return response.data
}

const inventoryService = {
  getInventoryStatus,
  getProductInventoryHistory,
  adjustInventory,
  getLowStockItems,
}

export default inventoryService

