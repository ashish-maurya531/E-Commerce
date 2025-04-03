const express = require('express');
// const path = require('path');

const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const path = require("path")
const moment = require('moment-timezone')
const multer = require('multer')
const fs = require('fs')
const db = require('./config/database')
const imageRoutes = require('./routes/image.routes')
const adminAuthRoutes = require("./routes/adminAuth.routes");

// Load environment variables
dotenv.config()

// Create uploads directories if they don't exist
const createUploadDirs = () => {
  const dirs = ['products', 'categories']
  dirs.forEach(dir => {
    const uploadDir = path.join(__dirname, 'uploads', dir)
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true })
    }
  })
}
createUploadDirs()

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const uploadDir = path.join(__dirname, 'uploads', 'products')
    cb(null, uploadDir)
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9)
    cb(null, uniqueSuffix + path.extname(file.originalname))
  }
})

const upload = multer({ 
  storage: storage,
  fileFilter: (req, file, cb) => {
    const allowedTypes = /jpeg|jpg|png|gif/
    const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase())
    const mimetype = allowedTypes.test(file.mimetype)
    if (extname && mimetype) {
      return cb(null, true)
    } else {
      cb('Error: Images only!')
    }
  }
})

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

// Middleware setup
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
morgan.token('date', () => {
  return moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')
})
app.use(morgan('[:date[iso]] :method :url :status - :response-time ms'))

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))
app.use('/uploads/categories', express.static(path.join(__dirname, 'uploads/categories')))
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')))

// Add this line to serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Use image routes
// Add this line with your other routes
app.use('/images', imageRoutes);
 
// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", upload.array('images', 5), productRoutes)
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use('/api/images', imageRoutes)
// Admin routes
app.use("/api/admin/auth", adminAuthRoutes);
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

// Start server with database connection check
const PORT = process.env.PORT || 9000
const startServer = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`⚡ Server running on port ${PORT}`)
      console.log(`📅 Server Time (IST): ${moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')}`)
    })
  } catch (error) {
    console.error('❌ Database connection failed:', error.message)
    process.exit(1)
  }
}

startServer()



