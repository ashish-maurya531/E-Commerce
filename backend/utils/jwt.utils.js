const jwt = require("jsonwebtoken")

// Generate access token
const generateAccessToken = (user) => {
  return jwt.sign({ id: user.id, email: user.email, role: user.role }, process.env.JWT_SECRET || "your-secret-key", {
    expiresIn: "1m",
  })
}

// Generate refresh token
const generateRefreshToken = (user) => {
  return jwt.sign({ id: user.id }, process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key", { expiresIn: "7d" })
}

// Verify refresh token
const verifyRefreshToken = (token) => {
  try {
    return jwt.verify(token, process.env.REFRESH_TOKEN_SECRET || "your-refresh-secret-key")
  } catch (error) {
    return null
  }
}

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyRefreshToken,
}

