import { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import API from "../api.js";

function PostDetails() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [post, setPost] = useState(null);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchPost = async () => {
    try {
      const { data } = await API.get(`/posts/${id}`);
      setPost(data);
    } catch (err) {
      setError("Post not found");
    }
  };

  const deletePost = async () => {
    const confirmDelete = window.confirm("Delete this post?");
    if (!confirmDelete) return;

    try {
      await API.delete(`/posts/${id}`);
      navigate("/");
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchPost();
  }, [id]);

  if (error) return <div className="error">{error}</div>;
  if (!post) return <p>Loading post...</p>;

  return (
    <article className="post-details">
      {post.image && <img src={post.image} alt={post.title} />}

      <span className="category">{post.category}</span>
      <h1>{post.title}</h1>

      <small>
        By {post.author?.name || "Unknown"} ·{" "}
        {new Date(post.createdAt).toLocaleDateString()}
      </small>

      <p>{post.content}</p>

      {user && post.author?._id === user._id && (
        <div className="actions">
          <Link to={`/edit/${post._id}`} className="btn btn-light">
            Edit Post
          </Link>
          <button onClick={deletePost} className="btn btn-danger">
            Delete Post
          </button>
        </div>
      )}
    </article>
  );
}

export default PostDetails;
