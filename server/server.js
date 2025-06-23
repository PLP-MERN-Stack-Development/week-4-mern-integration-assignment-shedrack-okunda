const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const path = require("path");

// Import routes
const postRoutes = require("./routes/posts");
const categoryRoutes = require("./routes/categories");
// const authRoutes = require("./routes/auth");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/errorHandler");

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Log requests in development mode
if (process.env.NODE_ENV === "development") {
	app.use((req, res, next) => {
		console.log(`${req.method} ${req.url}`);
		next();
	});
}

// API routes
app.use("/api/posts", postRoutes);
app.use("/api/categories", categoryRoutes);
// app.use("/api/auth", authRoutes);

// Root route
app.get("/", (req, res) => {
	res.send("MERN Blog API is running");
});

// Error handling middleware
app.use(errorHandler);

// Connect to MongoDB and start server
connectDB();

app.listen(PORT, () => {
	console.log(`Server running on port ${PORT}`);
});

// Handle unhandled promise rejections
process.on("unhandledRejection", (err) => {
	console.error("Unhandled Promise Rejection:", err);
	// Close server & exit process
	process.exit(1);
});

module.exports = app;
