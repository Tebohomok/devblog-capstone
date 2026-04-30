import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api.js";

function Login({ setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await API.post("/auth/login", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <div className="auth-card">
      <h1>Login</h1>
      <p>Login to manage your blog posts.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="email"
          type="email"
          placeholder="Email address"
          value={formData.email}
          onChange={handleChange}
        />

        <input
          name="password"
          type="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
        />

        <button className="btn" type="submit">
          Login
        </button>
      </form>

      <p>
        No account yet? <Link to="/register">Register</Link>
      </p>
    </div>
  );
}

export default Login;
