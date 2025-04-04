import React from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
export default function ProtectedRoute({ children }) {
  // const handleToken = async () => {
  //   const refreshToken = localStorage.getItem("refreshToken");
  //   if (refreshToken) {
  //     try {
  //       const response = await axios.post("https://gk4rbn12-6000.inc1.devtunnels.ms/api/users/user-refresh-token", {
  //         method: "POST",
  //         headers: {
  //           "Content-Type": "application/json",
  //           Authorization: `Bearer ${refreshToken}`,
  //         },
  //       });
  //       if (response.ok) {
  //         const data = await response.json();
  //         localStorage.setItem("accessToken", data.accessToken);
  //       } else {
  //         localStorage.removeItem("accessToken");
  //         localStorage.removeItem("refreshToken");
  //         navigate("/auth");
  //       }
  //     } catch (error) {
  //       console.error("Error refreshing token:", error);
  //       localStorage.removeItem("accessToken");
  //       localStorage.removeItem("refreshToken");
  //       navigate("/auth")
  //     }
  //   } else {
  //     localStorage.removeItem("accessToken");
  //     localStorage.removeItem("refreshToken");
  //     navigate("/auth")
  //   }
  // };
  const isAuthenticated = !!localStorage.getItem("accessToken");
  // if(!localStorage.getItem("accessToken")){
  //   {handleToken}
  // }
  return (
    <div>
      {isAuthenticated ? (
        children
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h1 className="text-2xl font-bold mb-4">Access Denied</h1>
          <p className="mb-4">You must be logged in to view this page.</p>
          <Link to="/auth" className="text-blue-500 hover:underline">
            Go to Login
          </Link>
        </div>
      )}
    </div>
  );
}