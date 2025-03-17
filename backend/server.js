const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const path = require("path")

// Load environment variables
dotenv.config()

// Import routes
const authRoutes = require("./routes/auth.routes")
const productRoutes = require("./routes/product.routes")
const orderRoutes = require("./routes/order.routes")
const userRoutes = require("./routes/user.routes")
const categoryRoutes = require("./routes/category.routes")
const inventoryRoutes = require("./routes/inventory.routes")
const dashboardRoutes = require("./routes/dashboard.routes")

// Initialize express app
const app = express()

// Middleware
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(morgan("dev"))

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/dashboard", dashboardRoutes)

// Root route
app.get("/", (req, res) => {
  res.json({ message: "Welcome to Medicine E-commerce API" })
})

// Error handling middleware
app.use((err, req, res, next) => {
  const statusCode = err.statusCode || 500
  res.status(statusCode).json({
    status: "error",
    statusCode,
    message: err.message,
    stack: process.env.NODE_ENV === "production" ? "🥞" : err.stack,
  })
})

// Start server
const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})

