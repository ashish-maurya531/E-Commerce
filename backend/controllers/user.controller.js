const bcrypt = require("bcryptjs")
const { users } = require("../data/users")
const db = require("../config/database")
const { v4: uuidv4 } = require('uuid')
//jwt
const jwt = require('jsonwebtoken')
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt.utils")

const userController = {
  // Get all users
  getAllUsers: async (req, res) => {
    try {
      const [users] = await db.query(`
        SELECT id, firstname, lastname, email, phoneno, 
               address, city, state, pincode, role, 
               createdat, status
        FROM usersdetails
        ORDER BY createdat DESC
      `)
      res.status(200).json(users)
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },

  // Get a single user by ID
  getUserById: async (req, res) => {
    try {
      const { id } = req.body
      const [user] = await db.query(`
        SELECT id, firstname, lastname, email, phoneno, 
               address, city, state, pincode, role, 
               createdat, status
        FROM usersdetails 
        WHERE id = ?
      `, [id])

      if (!user.length) {
        return res.status(404).json({ message: "User not found" })
      }

      res.status(200).json(user[0])
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },

  // Create a new user
  createUser: async (req, res) => {
    try {
      const { 
        firstname, lastname, email, password, 
        phoneno, address, city, state, pincode
      } = req.body

      // Check if user already exists
      const [existingUser] = await db.query(
        'SELECT id FROM usersdetails WHERE email = ? OR phoneno = ?', 
        [email, phoneno]
      )

      if (existingUser.length) {
        return res.status(400).json({ message: "User already exists" })
      }

      // Generate unique user ID
      const userId = `UHI-${uuidv4().substring(0, 8)}`

      // Create new user
      await db.query(`
        INSERT INTO usersdetails (
          id, firstname, lastname, email, password, 
          phoneno, address, city, state, pincode
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      `, [
        userId, firstname, lastname, email, password,
        phoneno, address, city, state, pincode,
      ])

      res.status(201).json({ 
        message: "User created successfully",
        userId 
      })
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },

  // Update user
  updateUser: async (req, res) => {
    try {
      const { id } = req.params
      const { 
        firstname, lastname, email, password, 
        phoneno, address, city, state, pincode, role, status 
      } = req.body

      // Check if user exists
      const [existingUser] = await db.query(
        'SELECT id FROM usersdetails WHERE id = ?', 
        [id]
      )

      if (!existingUser.length) {
        return res.status(404).json({ message: "User not found" })
      }

      // Update user
      await db.query(`
        UPDATE usersdetails 
        SET firstname = ?, lastname = ?, email = ?,
            ${password ? 'password = ?,' : ''} 
            phoneno = ?, address = ?, city = ?,
            state = ?, pincode = ?, role = ?, status = ?
        WHERE id = ?
      `, [
        firstname, lastname, email,
        ...(password ? [password] : []),
        phoneno, address, city, state, pincode, role, status, id
      ])

      res.json({ message: "User updated successfully" })
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },

  // Delete user
  deleteUser: async (req, res) => {
    try {
      const { id } = req.params

      // Check if user exists
      const [existingUser] = await db.query(
        'SELECT id FROM usersdetails WHERE id = ?', 
        [id]
      )

      if (!existingUser.length) {
        return res.status(404).json({ message: "User not found" })
      }

      // Delete user
      await db.query('DELETE FROM usersdetails WHERE id = ?', [id])

      res.json({ message: "User deleted successfully" })
    } catch (error) {
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },



  userLogin: async (req, res) => {
    try {
      const { email, password } = req.body
  
      // Check if user exists
      const [user] = await db.query(
        'SELECT id, firstname, lastname, email, password, role FROM usersdetails WHERE email = ?',
        [email]
      )
  
      if (!user.length) {
        return res.status(401).json({ message: "Invalid email or password" })
      }
  
      // Check password (using bcrypt for security)
      const isMatch = (password===user[0].password?true:false)
      if (!isMatch) {
        return res.status(401).json({ message: "Invalid email or password" })
      }
  
      // Generate tokens
      const accessToken = generateAccessToken({
        id: user[0].id,
        email: user[0].email,
        role: user[0].role
      })
  
      const refreshToken = generateRefreshToken({
        id: user[0].id
      })
  
      // Store refresh token in the database
      await db.query(
        `INSERT INTO user_tokens (user_id, refresh_token, created_at, updated_at)
         VALUES (?, ?, NOW(), NOW())
         ON DUPLICATE KEY UPDATE
             refresh_token = VALUES(refresh_token),
             updated_at = NOW()`,
        [user[0].id, refreshToken]
      )
  
      res.json({
        message: "Login successful",
        user: {
          id: user[0].id,
          firstname: user[0].firstname,
          lastname: user[0].lastname,
          email: user[0].email,
          role: user[0].role
        },
        accessToken,
        refreshToken
      })
  
    } catch (error) {
      console.error("Login error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },

  userLogout: async (req, res) => {
    try {
      const { refreshToken } = req.body

      // Check if refresh token exists
      const [token] = await db.query(
        'SELECT user_id FROM user_tokens WHERE refresh_token =?',
        [refreshToken]
      )
      if (!token.length) {
        return res.status(401).json({ message: "Invalid refresh token" })
      }
      // Delete refresh token from the database
      await db.query('DELETE FROM user_tokens WHERE refresh_token =?', [refreshToken])
      res.json({ message: "Logout successful" })
    } catch (error) {
      console.error("Logout error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },
  updateUserProfile: async (req, res) => {
    try {
      const { id } = req.user
      const { firstname, lastname, email, password, phoneno, address, city, state, pincode } = req.body
      // Check if user exists
      const [user] = await db.query(
        'SELECT id FROM usersdetails WHERE id =?',
        [id]
      )
      if (!user.length) {
        return res.status(404).json({ message: "User not found" })
      }
      // Update user profile
      await db.query(`
        UPDATE usersdetails
        SET firstname =?, lastname =?, email =?,
            ${password? 'password =?,' : ''}
            phoneno =?, address =?, city =?,
            state =?, pincode =?
        WHERE id =?
      `, [
        firstname, lastname, email,
        ...(password? [password] : []),
        phoneno, address, city, state, pincode,
        id
      ])
      res.json({ message: "User profile updated successfully" })
    } catch (error) {
      console.error("Update user profile error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  },



  user_refreshToken: async (req, res) => {
    try {
      const { refreshToken } = req.body
      // Check if refresh token exists
      const [token] = await db.query(
        'SELECT user_id FROM user_tokens WHERE refresh_token =?',
        [refreshToken]
      )
      if (!token.length) {
        return res.status(401).json({ message: "Invalid refresh token" })
      } 
      // Generate new access token
      const accessToken = generateAccessToken({
        id: token[0].id,
        email: token[0].email,
        role: token[0].role
      })
      res.json({ accessToken })
    } catch (error) {
      console.error("Refresh token error:", error)
      res.status(500).json({ message: "Server error", error: error.message })
    }
  }

}

module.exports = userController

