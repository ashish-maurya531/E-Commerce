import { Navigate, useLocation } from "react-router-dom"
import { useEffect } from "react"
import authService from "../services/auth.service"

const ProtectedRoute = ({ children }) => {
  const location = useLocation()
  const user = authService.getCurrentUser()

  useEffect(() => {
    const checkTokenExpiry = async () => {
      try {
        await authService.getProfile() // This will trigger token refresh if needed
      } catch (error) {
        // If error occurs, token is invalid or refresh failed
        authService.logout()
        window.location.href = "/admin/login"
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