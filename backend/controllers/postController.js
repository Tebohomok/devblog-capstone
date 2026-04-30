import Post from "../models/Post.js";
import cloudinary from "../config/cloudinary.js";

export const createPost = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    if (!title || !content) {
      return res
        .status(400)
        .json({ message: "Title and content are required" });
    }

    const post = await Post.create({
      title,
      content,
      category,
      image,
      author: req.user._id,
    });

    res.status(201).json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "name email")
      .sort({ createdAt: -1 });

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id).populate(
      "author",
      "name email",
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updatePost = async (req, res) => {
  try {
    const { title, content, category, image } = req.body;

    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to update this post" });
    }

    post.title = title || post.title;
    post.content = content || post.content;
    post.category = category || post.category;
    post.image = image || post.image;

    const updatedPost = await post.save();

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    if (post.author.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not allowed to delete this post" });
    }

    await post.deleteOne();

    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
export const uploadImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file uploaded" });
    }

    const fileBase64 = `data:${req.file.mimetype};base64,${req.file.buffer.toString(
      "base64",
    )}`;

    const result = await cloudinary.uploader.upload(fileBase64, {
      folder: "devblog_posts",
    });

    res.status(200).json({
      imageUrl: result.secure_url,
      publicId: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
