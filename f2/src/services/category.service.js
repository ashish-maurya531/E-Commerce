import api from "./api"

// Get all categories
const getAllCategories = async () => {
  const response = await api.get("/categories")
  return response.data
}

// Get a single category by ID
const getCategoryById = async (id) => {
  const response = await api.get(`/categories/${id}`)
  return response.data
}

// Create a new category
const createCategory = async (categoryData) => {
  const response = await api.post("/categories", categoryData)
  return response.data
}

// Update a category
const updateCategory = async (id, categoryData) => {
  const response = await api.put(`/categories/${id}`, categoryData)
  return response.data
}

// Delete a category
const deleteCategory = async (id) => {
  const response = await api.delete(`/categories/${id}`)
  return response.data
}

const categoryService = {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
}

export default categoryService

