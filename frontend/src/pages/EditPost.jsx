import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import API from "../api.js";

function EditPost() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: "",
    category: "",
    content: "",
    image: "",
  });

  const [imageFile, setImageFile] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);

      setFormData({
        title: data.title,
        category: data.category,
        content: data.content,
        image: data.image || "",
      });
    } catch (err) {
      setError("Failed to load post");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const uploadImage = async () => {
    if (!imageFile) return formData.image;

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

      await API.put(`/posts/${id}`, {
        ...formData,
        image: imageUrl,
      });

      navigate(`/posts/${id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update post");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="form-card">
      <h1>Edit Blog Post</h1>

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

        {formData.image && (
          <img src={formData.image} alt="Current" className="preview-img" />
        )}

        <label className="file-label">
          Replace featured image
          <input
            type="file"
            accept="image/*"
            onChange={(e) => setImageFile(e.target.files[0])}
          />
        </label>

        <button className="btn" type="submit" disabled={loading}>
          {loading ? "Updating..." : "Update Post"}
        </button>
      </form>
    </div>
  );
}

export default EditPost;
