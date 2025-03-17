import api from "./api"

// Get all users
const getAllUsers = async () => {
  const response = await api.get("/users")
  return response.data
}

// Get a single user by ID
const getUserById = async (id) => {
  const response = await api.get(`/users/${id}`)
  return response.data
}

// Create a new user
const createUser = async (userData) => {
  const response = await api.post("/users", userData)
  return response.data
}

// Update a user
const updateUser = async (id, userData) => {
  const response = await api.put(`/users/${id}`, userData)
  return response.data
}

// Delete a user
const deleteUser = async (id) => {
  const response = await api.delete(`/users/${id}`)
  return response.data
}

const userService = {
  getAllUsers,
  getUserById,
  createUser,
  updateUser,
  deleteUser,
}

export default userService

