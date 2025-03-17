import api from "./api"

// Register a new user
const register = async (userData) => {
  const response = await api.post("/auth/register", userData)
  return response.data
}

// Login user
const login = async (email, password) => {
  const response = await api.post("/auth/login", { email, password })

  if (response.data.accessToken) {
    localStorage.setItem("accessToken", response.data.accessToken)
    localStorage.setItem("refreshToken", response.data.refreshToken)
    localStorage.setItem("user", JSON.stringify(response.data.user))
  }

  return response.data
}

// Logout user
const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken")

  if (refreshToken) {
    try {
      await api.post("/auth/logout", { refreshToken })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  localStorage.removeItem("accessToken")
  localStorage.removeItem("refreshToken")
  localStorage.removeItem("user")
}

// Get current user
const getCurrentUser = () => {
  const userStr = localStorage.getItem("user")
  if (userStr) {
    return JSON.parse(userStr)
  }
  return null
}

// Get user profile
const getProfile = async () => {
  const response = await api.get("/auth/profile")
  return response.data
}

const authService = {
  register,
  login,
  logout,
  getCurrentUser,
  getProfile,
}

export default authService

