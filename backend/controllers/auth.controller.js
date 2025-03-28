const bcrypt = require("bcryptjs")
const { users, refreshTokens } = require("../data/users")
const { generateAccessToken, generateRefreshToken, verifyRefreshToken } = require("../utils/jwt.utils")

// Register a new user
const register = (req, res) => {
  try {
    const { firstName, lastName, email, password, phone, address } = req.body

    // Check if user already exists
    const existingUser = users.find((user) => user.email === email)
    if (existingUser) {
      return res.status(400).json({ message: "User already exists" })
    }

    // Create new user
    const newUser = {
      id: users.length + 1,
      firstName,
      lastName,
      email,
      password: bcrypt.hashSync(password, 10),
      role: "customer", // Default role for new registrations
      phone,
      address,
      status: "active",
      createdAt: new Date().toISOString(),
    }

    // Add user to the array (in a real app, this would be a database insert)
    users.push(newUser)

    // Generate tokens
    const accessToken = generateAccessToken(newUser)
    const refreshToken = generateRefreshToken(newUser)

    // Store refresh token
    refreshTokens.push(refreshToken)

    // Return user info and tokens
    res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser.id,
        firstName: newUser.firstName,
        lastName: newUser.lastName,
        email: newUser.email,
        role: newUser.role,
      },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Login user
const login = (req, res) => {
  try {
    const { email, password } = req.body 

    // Find user
    const user = users.find((user) => user.email === email)
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check password
    const isPasswordValid = bcrypt.compareSync(password, user.password)
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" })
    }

    // Check if user is active
    if (user.status !== "active") {
      return res.status(401).json({ message: "Account is not active" })
    }

    // Generate tokens
    const accessToken = generateAccessToken(user)
    const refreshToken = generateRefreshToken(user)

    // Store refresh token
    refreshTokens.push(refreshToken)

    // Return user info and tokens
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        role: user.role,
      },
      accessToken,
      refreshToken,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Refresh token
const refreshToken = (req, res) => {
  try {
    const { refreshToken: token } = req.body

    // Check if refresh token exists
    if (!token) {
      return res.status(401).json({ message: "Refresh token is required" })
    }

    // Check if refresh token is in the array
    if (!refreshTokens.includes(token)) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }

    // Verify refresh token
    const decoded = verifyRefreshToken(token)
    if (!decoded) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }

    // Find user
    const user = users.find((user) => user.id === decoded.id)
    if (!user) {
      return res.status(403).json({ message: "Invalid refresh token" })
    }

    // Generate new access token
    const accessToken = generateAccessToken(user)

    // Return new access token
    res.status(200).json({
      accessToken,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Logout user
const logout = (req, res) => {
  try {
    const { refreshToken: token } = req.body

    // Remove refresh token from the array
    const tokenIndex = refreshTokens.indexOf(token)
    if (tokenIndex !== -1) {
      refreshTokens.splice(tokenIndex, 1)
    }

    res.status(200).json({ message: "Logout successful" })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

// Get current user profile
const getProfile = (req, res) => {
  try {
    // Find user
    const user = users.find((user) => user.id === req.user.id)
    if (!user) {
      return res.status(404).json({ message: "User not found" })
    }

    // Return user info
    res.status(200).json({
      id: user.id,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      role: user.role,
      phone: user.phone,
      address: user.address,
      status: user.status,
      createdAt: user.createdAt,
    })
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message })
  }
}

module.exports = {
  register,
  login,
  refreshToken,
  logout,
  getProfile,
}

