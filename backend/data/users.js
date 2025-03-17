const bcrypt = require("bcryptjs")

// Dummy users data
const users = [
  {
    id: 1,
    firstName: "Admin",
    lastName: "User",
    email: "admin@example.com",
    password: bcrypt.hashSync("admin123", 10),
    role: "admin",
    phone: "+91 9876543210",
    address: "123 Admin St, Mumbai, Maharashtra, 400001",
    status: "active",
    createdAt: "2023-01-01T00:00:00.000Z",
  },
  {
    id: 2,
    firstName: "Franchiser",
    lastName: "User",
    email: "franchiser@example.com",
    password: bcrypt.hashSync("franchiser123", 10),
    role: "franchiser",
    phone: "+91 9876543211",
    address: "456 Franchiser Ave, Delhi, 110001",
    status: "active",
    createdAt: "2023-01-15T00:00:00.000Z",
  },
  {
    id: 3,
    firstName: "Distributor",
    lastName: "User",
    email: "distributor@example.com",
    password: bcrypt.hashSync("distributor123", 10),
    role: "distributor",
    phone: "+91 9876543212",
    address: "789 Distributor Rd, Bangalore, Karnataka, 560001",
    status: "active",
    createdAt: "2023-02-01T00:00:00.000Z",
  },
  {
    id: 4,
    firstName: "Customer",
    lastName: "User",
    email: "customer@example.com",
    password: bcrypt.hashSync("customer123", 10),
    role: "customer",
    phone: "+91 9876543213",
    address: "101 Customer Blvd, Chennai, Tamil Nadu, 600001",
    status: "active",
    createdAt: "2023-02-15T00:00:00.000Z",
  },
]

// Store refresh tokens
const refreshTokens = []

module.exports = {
  users,
  refreshTokens,
}

