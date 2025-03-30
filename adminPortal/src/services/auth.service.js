import api from "./api";

const authService = {
  // Admin Login
  login: async (email, password) => {
    try {
      const response = await api.post("/admin/auth/login", { email, password });
      if (response.data.adminAccessToken) {
        localStorage.setItem("adminAccessToken", response.data.adminAccessToken);
        localStorage.setItem("adminRefreshToken", response.data.adminRefreshToken);
        localStorage.setItem("adminUser", JSON.stringify(response.data.adminUser));
      }
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Admin Logout
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("adminRefreshToken");
      if (refreshToken) {
        await api.post("/admin/auth/logout", { refreshToken });
      }
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      localStorage.removeItem("adminAccessToken");
      localStorage.removeItem("adminRefreshToken");
      localStorage.removeItem("adminUser");
    }
  },

  // Get current admin user
  getCurrentUser: () => {
    try {
      const userStr = localStorage.getItem("adminUser");
      return userStr ? JSON.parse(userStr) : null;
    } catch (error) {
      console.error("Error getting current user:", error);
      return null;
    }
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem("adminAccessToken");
    const user = localStorage.getItem("adminUser");
    return !!(token && user);
  },

  // Refresh token
  refreshToken: async () => {
    try {
      const refreshToken = localStorage.getItem("adminRefreshToken");
      console.log("Refreshing token from", refreshToken);
      console.log("Refreshing token with:", refreshToken);
      if (!refreshToken) throw new Error("No refresh token found");

      const response = await api.post("/admin/auth/refresh-token", { refreshToken });
      if (response.data.adminAccessToken) {
        localStorage.setItem("adminAccessToken", response.data.adminAccessToken);
        return response.data.adminAccessToken;
      }
    } catch (error) {
      throw error;
    }
  },
  getProfile: async () => {
    console.log("Getting profile...");
    const response = await api.get("/admin/auth/profile")
    return response.data
  }
};



export default authService;





