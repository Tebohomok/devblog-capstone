import postRoutes from "./routes/postRoutes.js";
import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import authRoutes from "./routes/authRoutes.js";

dotenv.config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Test route
app.get("/", (req, res) => {
  res.send("DevBlog API is running...");
});

// Routes
app.use("/api/auth", authRoutes);
app.use("/api/posts", postRoutes);

// Start server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

// Connect MongoDB
if (
  process.env.MONGO_URI &&
  process.env.MONGO_URI !== "your_mongodb_connection_string"
) {
  mongoose
    .connect(process.env.MONGO_URI)
    .then(() => console.log("MongoDB connected"))
    .catch((error) => console.log("MongoDB connection error:", error.message));
} else {
  console.log("MongoDB not connected yet. Add MONGO_URI later.");
}
