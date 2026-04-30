import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../api.js";

function CreatePost() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImage = async () => {
    if (!imageFile) return "";

    const data = new FormData();
    data.append("image", imageFile);

    const response = await API.post("/posts/upload", data, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data.imageUrl;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const imageUrl = await uploadImage();

      await API.post("/posts", {
        ...formData,
        image: imageUrl,
      });

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to create post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h1>Create Blog Post</h1>
      <p>Add a new blog post to MongoDB through your Express API.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="title"
          placeholder="Post title"
          value={formData.title}
          onChange={handleChange}
        />

        <input
          name="category"
          placeholder="Category"
          value={formData.category}
          onChange={handleChange}
        />

        <textarea
          name="content"
          placeholder="Write your blog content..."
          value={formData.content}
          onChange={handleChange}
          rows="8"
        />

        <label className="file-label">
          Upload featured image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Creating..." : "Create Post"}
        </button>
      </form>
    </div>
  );
}

export default CreatePost;
