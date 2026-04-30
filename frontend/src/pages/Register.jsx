import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import API from "../api.js";

function Register({ setUser }) {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
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
      const { data } = await API.post("/auth/register", formData);

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data));
      setUser(data);

      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <div className="auth-card">
      <h1>Create Account</h1>
      <p>Register to start writing blog posts.</p>

      {error && <div className="error">{error}</div>}

      <form onSubmit={handleSubmit}>
        <input
          name="name"
          placeholder="Full name"
          value={formData.name}
          onChange={handleChange}
        />

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
          Register
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
}

export default Register;
