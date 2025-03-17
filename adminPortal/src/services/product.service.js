import api from "./api"

// Get all products
const getAllProducts = async (params) => {
  const response = await api.get("/products", { params })
  return response.data
}

// Get a single product by ID
const getProductById = async (id) => {
  const response = await api.get(`/products/${id}`)
  return response.data
}

// Create a new product
const createProduct = async (productData) => {
  const response = await api.post("/products", productData)
  return response.data
}

// Update a product
const updateProduct = async (id, productData) => {
  const response = await api.put(`/products/${id}`, productData)
  return response.data
}

// Delete a product
const deleteProduct = async (id) => {
  const response = await api.delete(`/products/${id}`)
  return response.data
}

const productService = {
  getAllProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
}

export default productService

