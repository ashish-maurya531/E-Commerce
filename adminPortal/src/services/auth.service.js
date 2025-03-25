import api from "./api"

// Register a new user
const register = async (userData) => {
  const response = await api.post("/auth/register", userData)
  return response.data
}

// Login user
const login = async (email, password) => {
  try {
    const response = await api.post("/auth/login", { email, password })
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken)
      localStorage.setItem("refreshToken", response.data.refreshToken)
      localStorage.setItem("user", JSON.stringify(response.data.user))
    } 
    return response.data
  } catch (error) {
    throw error
  }
}

const logout = async () => {
  const refreshToken = localStorage.getItem("refreshToken")
  if (refreshToken) {
    try {
      await api.post("/auth/logout", { refreshToken })
    } catch (error) {
      console.error("Logout error:", error)
    }
  }
  localStorage.clear()
}

// Add a new method to check refresh token validity
const checkRefreshToken = async () => {
  const refreshToken = localStorage.getItem("refreshToken")
  if (!refreshToken) return false

  try {
    const response = await api.post("/auth/refresh-token", { refreshToken })
    if (response.data.accessToken) {
      localStorage.setItem("accessToken", response.data.accessToken)
      return true
    }
    return false
  } catch (error) {
    return false
  }
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
  checkRefreshToken,
}

export default authService





