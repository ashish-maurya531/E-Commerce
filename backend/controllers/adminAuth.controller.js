// const bcrypt = require("bcryptjs");
const db = require('../config/database');
const { generateAccessToken, generateRefreshToken } = require("../utils/jwt.utils");

const adminAuthController = {
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      // Find admin
      const [admins] = await db.query('SELECT * FROM admin WHERE email = ?', [email]);
      const admin = admins[0];

      if (!admin) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Verify password
      const isPasswordValid = (password===admin.password?true:false);
      if (!isPasswordValid) {
        return res.status(401).json({ message: "Invalid credentials" });
      }

      // Generate tokens
      const accessToken = generateAccessToken({
        id: admin.id,
        email: admin.email,
        role: admin.role
      });
      
      const refreshToken = generateRefreshToken({
        id: admin.id
      });

      // Store refresh token (you might want to store this in the database)
      await db.query(
        'UPDATE admin SET refresh_token = ? WHERE id = ?',
        [refreshToken, admin.id]
      );

      res.json({
        message: "Login successful",
        adminUser: {
          id: admin.id,
          email: admin.email,
          name: admin.name,
          role: admin.role
        },
        adminAccessToken: accessToken,
        adminRefreshToken: refreshToken
      });
    } catch (error) {
      console.error('Login error:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },

  logout: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      // Clear refresh token from database
      await db.query(
        'UPDATE admin SET refresh_token = NULL WHERE refresh_token = ?',
        [refreshToken]
      );

      res.json({ message: "Logged out successfully" });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  getProfile:async (req, res) => {
    try {
      const userId = req.user.id;
      console.log(userId);
      // Fetch user profile
      const [user] = await db.query('SELECT id, email, name, role FROM admin WHERE id =?', [userId]);
      res.json({ user });
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message });
    }
  },
  //refresh token 
  refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body;
      
      if (!refreshToken) {
        return res.status(401).json({ message: "Refresh token is required" });
      }
      
      // Get admin with the refresh token
      const [admins] = await db.query(
        'SELECT id, email, role FROM admin WHERE refresh_token = ?', 
        [refreshToken]
      );
      const admin = admins[0];

      if (!admin) {
        return res.status(403).json({ message: "Invalid refresh token" });
      }

      // Generate new access token
      const accessToken = generateAccessToken({
        id: admin.id,
        email: admin.email,
        role: admin.role
      });

      res.json({ adminAccessToken: accessToken });
    } catch (error) {
      console.error('Refresh token error:', error);
      res.status(500).json({ message: "Server error", error: error.message });
    }
  }
}


 


module.exports = adminAuthController;