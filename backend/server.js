const express = require("express")
const cors = require("cors")
const morgan = require("morgan")
const dotenv = require("dotenv")
const path = require("path")
const moment = require('moment-timezone');
const db = require('./config/database');
const imageRoutes = require('./routes/image.routes');

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

// Middleware setup
app.use(cors())
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
// app.use(morgan("dev"))
morgan.token('date', () => {
  return moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss');
});
app.use(morgan('[:date[iso]] :method :url :status - :response-time ms'));

// Static files
app.use("/uploads", express.static(path.join(__dirname, "uploads")))

// Serve static files from uploads directories
app.use('/uploads/categories', express.static(path.join(__dirname, 'uploads/categories')));
app.use('/uploads/products', express.static(path.join(__dirname, 'uploads/products')));

// Routes
app.use("/api/auth", authRoutes)
app.use("/api/products", productRoutes) 
app.use("/api/orders", orderRoutes)
app.use("/api/users", userRoutes)
app.use("/api/categories", categoryRoutes)
app.use("/api/inventory", inventoryRoutes)
app.use("/api/dashboard", dashboardRoutes)
app.use('/api/images', imageRoutes);

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
const PORT = process.env.PORT || 5000
const startServer = async () => {
  try {
    // Test database connection
    const [result] = await db.query('SELECT 1');
    console.log('✅ Database connected successfully');
    
    app.listen(PORT, () => {
      console.log(`⚡ Server running on port ${PORT}`);
      console.log(`📅 Server Time (IST): ${moment().tz("Asia/Kolkata").format('YYYY-MM-DD HH:mm:ss')}`);
    });
  } catch (error) {
    console.error('❌ Database connection failed:', error.message);
    process.exit(1);
  }
};

startServer();

