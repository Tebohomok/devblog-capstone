import { Routes, Route, Link, Navigate, useNavigate } from "react-router-dom";
import { useState } from "react";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Register from "./pages/Register.jsx";
import CreatePost from "./pages/CreatePost.jsx";
import EditPost from "./pages/EditPost.jsx";
import PostDetails from "./pages/PostDetails.jsx";

function App() {
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const isLoggedIn = Boolean(localStorage.getItem("token"));

  return (
    <>
      <Navbar user={user} setUser={setUser} />

      <main className="container">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts/:id" element={<PostDetails />} />

          <Route path="/login" element={<Login setUser={setUser} />} />

          <Route path="/register" element={<Register setUser={setUser} />} />

          <Route
            path="/create"
            element={isLoggedIn ? <CreatePost /> : <Navigate to="/login" />}
          />

          <Route
            path="/edit/:id"
            element={isLoggedIn ? <EditPost /> : <Navigate to="/login" />}
          />
        </Routes>
      </main>
    </>
  );
}

function Navbar({ user, setUser }) {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <nav className="navbar">
      <Link to="/" className="logo">
        DevBlog
      </Link>

      <div className="nav-links">
        <Link to="/">Home</Link>

        {user ? (
          <>
            <Link to="/create">Create Post</Link>
            <span className="welcome">Hi, {user.name}</span>
            <button onClick={logout} className="btn btn-light">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register" className="btn btn-light">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}

export default App;
