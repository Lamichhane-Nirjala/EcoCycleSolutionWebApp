import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/login.css";
import api from "../../api/axios";

function Login() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      // ✅ FIXED ROUTE
      const res = await api.post("/auth/login", form);

      // ✅ Save token correctly
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      
      // ✅ Set admin flag based on user type
      if (res.data.user.usertype === "Admin") {
        localStorage.setItem("isAdmin", "true");
      } else {
        localStorage.setItem("isAdmin", "false");
      }

      toast.success(res.data.message || "Login successful!");
      
      // ✅ Check user role and redirect accordingly
      if (res.data.user.usertype === "Admin") {
        setTimeout(() => navigate("/admin-dashboard"), 600);
      } else {
        setTimeout(() => navigate("/dashboard"), 600);
      }
    } catch (err) {
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  const handleBackgroundClick = (e) => {
    if (e.target.className === "auth-page") {
      navigate("/");
    }
  };

  return (
    <div className="auth-page" onClick={handleBackgroundClick}>
      <div className="auth-card floating-card">
        <h1>Welcome Back 👋</h1>
        <p>Login to continue recycling with EcoCycle</p>

        <form onSubmit={handleSubmit}>
          <input
            type="email"
            name="email"
            placeholder="Email address"
            value={form.email}
            onChange={handleChange}
            required
          />

          <input
            type="password"
            name="password"
            placeholder="Password"
            value={form.password}
            onChange={handleChange}
            required
          />

          <button type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
