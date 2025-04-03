import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function ProtectedRoute({ children }) {
  navigate = useNavigate();
  const handleToken = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        const response = await axios.post("https://gk4rbn12-6000.inc1.devtunnels.ms/api/users/user-refresh-token", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${refreshToken}`,
          },
        });
        if (response.ok) {
          const data = await response.json();
          localStorage.setItem("accessToken", data.accessToken);
        } else {
          localStorage.removeItem("accessToken");
          localStorage.removeItem("refreshToken");
          navigate("/auth");
        }
      } catch (error) {
        console.error("Error refreshing token:", error);
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        navigate("/auth")
      }
    } else {
      localStorage.removeItem("accessToken");
      localStorage.removeItem("refreshToken");
      navigate("/auth")
    }
  };
  const isAuthenticated = !!(localStorage.getItem("accessToken") || localStorage.getItem("refreshToken"));
  if(!localStorage.getItem("accessToken")){
    {handleToken}
  }

  return isAuthenticated ? children : <Navigate to="/auth" replace />;
}