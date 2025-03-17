const jwt = require("jsonwebtoken")
const { users } = require("../data/users")

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return res.status(401).json({ message: "No token provided" })
  }

  const token = authHeader.split(" ")[1]

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your-secret-key")

    // Check if user exists
    const user = users.find((u) => u.id === decoded.id)
    if (!user) {
      return res.status(401).json({ message: "Invalid token" })
    }

    // Attach user to request object
    req.user = {
      id: decoded.id,
      email: decoded.email,
      role: decoded.role,
    }

    next()
  } catch (error) {
    if (error.name === "TokenExpiredError") {
      return res.status(401).json({ message: "Token expired" })
    }
    return res.status(401).json({ message: "Invalid token" })
  }
}

// Middleware to check if user has admin role
const isAdmin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next()
  } else {
    res.status(403).json({ message: "Requires admin role" })
  }
}

// Middleware to check if user has franchiser role
const isFranchiser = (req, res, next) => {
  if (req.user && (req.user.role === "franchiser" || req.user.role === "admin")) {
    next()
  } else {
    res.status(403).json({ message: "Requires franchiser role" })
  }
}

// Middleware to check if user has distributor role
const isDistributor = (req, res, next) => {
  if (req.user && (req.user.role === "distributor" || req.user.role === "admin" || req.user.role === "franchiser")) {
    next()
  } else {
    res.status(403).json({ message: "Requires distributor role" })
  }
}

module.exports = {
  verifyToken,
  isAdmin,
  isFranchiser,
  isDistributor,
}

