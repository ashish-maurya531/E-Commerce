import { Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import authService from "../services/auth.service"

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const user = authService.getCurrentUser()

  useEffect(() => {
    const checkTokenExpiry = async () => {
      try {
        // Check if token needs refresh by making a profile request
        await authService.getProfile()
      } catch (error) {
        if (error.response?.status === 401) {
          try {
            // Try to refresh the token
            await authService.refreshToken()
            
            // Retry the profile request after token refresh
            await authService.getProfile()
          } catch (refreshError) {
            // If refresh fails, logout and redirect
            authService.logout()
            window.location.href = "/admin/login"
          }
        } else {
          // For other errors, logout and redirect
          authService.logout()
          window.location.href = "/admin/login"
        }
      }
    }

    if (user) {
      checkTokenExpiry()
    }
  }, [])

  if (!user) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }

  return children
}

export default ProtectedRoute