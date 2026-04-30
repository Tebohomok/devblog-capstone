import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import API from "../api.js";

function Home() {
  const [posts, setPosts] = useState([]);
  const [error, setError] = useState("");

  const user = JSON.parse(localStorage.getItem("user") || "null");

  const fetchPosts = async () => {
    try {
      const { data } = await API.get("/posts");
      setPosts(data);
    } catch (err) {
      setError("Failed to load posts");
    }
  };

  const deletePost = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this post?",
    );
    if (!confirmDelete) return;

    try {
      await API.delete(`/posts/${id}`);
      fetchPosts();
    } catch (err) {
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div>
      <section className="hero">
        <h1>DevBlog</h1>
        <p>
          A full-stack blogging platform built with React, Express, MongoDB,
          JWT, Multer and Cloudinary.
        </p>
        <Link to="/create" className="btn">
          Create New Post
        </Link>
      </section>

      <h2>Latest Blog Posts</h2>

      {error && <div className="error">{error}</div>}

      <div className="grid">
        {posts.length === 0 ? (
          <p>No posts yet. Create your first blog post.</p>
        ) : (
          posts.map((post) => (
            <article className="card" key={post._id}>
              {post.image && <img src={post.image} alt={post.title} />}

              <div className="card-body">
                <span className="category">{post.category}</span>
                <h3>{post.title}</h3>
                <p>{post.content.substring(0, 120)}...</p>

                <small>
                  By {post.author?.name || "Unknown"} ·{" "}
                  {new Date(post.createdAt).toLocaleDateString()}
                </small>

                <div className="actions">
                  <Link to={`/posts/${post._id}`} className="btn btn-small">
                    Read More
                  </Link>

                  {user && post.author?._id === user._id && (
                    <>
                      <Link
                        to={`/edit/${post._id}`}
                        className="btn btn-small btn-light"
                      >
                        Edit
                      </Link>
                      <button
                        onClick={() => deletePost(post._id)}
                        className="btn btn-small btn-danger"
                      >
                        Delete
                      </button>
                    </>
                  )}
                </div>
              </div>
            </article>
          ))
        )}
      </div>
    </div>
  );
}

export default Home;
