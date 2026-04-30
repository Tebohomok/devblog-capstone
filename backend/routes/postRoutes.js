import express from "express";
import {
  createPost,
  getPosts,
  getPostById,
  updatePost,
  deletePost,
  uploadImage,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../middleware/uploadMiddleware.js";

const router = express.Router();

// Public routes
router.get("/", getPosts);
router.get("/:id", getPostById);

// Protected routes
router.post("/", protect, createPost);
router.post("/upload", protect, upload.single("image"), uploadImage);
router.put("/:id", protect, updatePost);
router.delete("/:id", protect, deletePost);

export default router;
