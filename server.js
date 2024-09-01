const express = require("express");
const cors = require("cors");
const connectDB = require("./config/dbConfig");
const authRoutes = require("./api/routes/authRoutes");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());
app.use(cors());

// Connect to MongoDB
connectDB();

// Set up routes
app.use("/api/auth", authRoutes);

// Start the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});