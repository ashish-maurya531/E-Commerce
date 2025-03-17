import axios from "axios"

// Create axios instance
const API_URL = "http://localhost:5000/api"

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
  },
})

// Add a request interceptor to add the auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("accessToken")
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

// Add a response interceptor to refresh the token if it's expired
api.interceptors.response.use(
  (response) => {
    return response
  },
  async (error) => {
    const originalRequest = error.config

    // If the error is 401 and we haven't already tried to refresh the token
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      try {
        // Try to refresh the token
        const refreshToken = localStorage.getItem("refreshToken")
        if (!refreshToken) {
          // No refresh token, redirect to login
          window.location.href = "/admin/login"
          return Promise.reject(error)
        }

        const response = await axios.post(`${API_URL}/auth/refresh-token`, {
          refreshToken,
        })

        // If we got a new token, save it and retry the original request
        if (response.data.accessToken) {
          localStorage.setItem("accessToken", response.data.accessToken)

          // Update the Authorization header
          originalRequest.headers["Authorization"] = `Bearer ${response.data.accessToken}`

          // Retry the original request
          return api(originalRequest)
        }
      } catch (refreshError) {
        // If refreshing the token fails, redirect to login
        localStorage.removeItem("accessToken")
        localStorage.removeItem("refreshToken")
        localStorage.removeItem("user")
        window.location.href = "/admin/login"
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  },
)

export default api

