import axios from 'axios'

const api = axios.create({
  baseURL: 'http://localhost:6000/api',
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add request interceptor to include auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('adminAccessToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Add response interceptor to handle token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true
      try {
        const refreshToken = localStorage.getItem('adminRefreshToken')
        const response = await axios.post('http://localhost:6000/api/admin/auth/refresh-token', {
          refreshToken
        })
        localStorage.setItem('adminAccessToken', response.data.adminAccessToken)
        originalRequest.headers.Authorization = `Bearer ${response.data.adminAccessToken}`
        return api(originalRequest)
      } catch (error) {
        localStorage.clear()
        window.location.href = '/admin/login'
        return Promise.reject(error)
      }
    }
    return Promise.reject(error)
  }
)

export default api

