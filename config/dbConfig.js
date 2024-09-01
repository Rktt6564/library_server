const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    await mongoose.connect("mongodb+srv://vikranthpadidam:iYF0p9er7ithjX5y@cluster0.i7qbox7.mongodb.net/playtime?retryWrites=true&w=majority");

    console.log("Connected to MongoDB");
  } catch (error) {
    console.error("MongoDB connection failed:", error.message);
    process.exit(1);
  }
};

module.exports = connectDB;