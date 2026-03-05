import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { toast } from "react-toastify";
import "../style/AdminLogin.css";
import api from "../../api/axios";

function AdminLogin() {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      console.log("Admin login attempt with email:", form.email);

      // Admin login using same endpoint but validates role
      const res = await api.post("/auth/login", form);
      
      console.log("✅ Login response:", res.data);
      console.log("🧑‍💼 User type:", res.data.user.usertype);

      // Check if user is admin
      if (res.data.user.usertype !== "Admin") {
        console.warn("❌ User is not admin, usertype:", res.data.user.usertype);
        toast.error("Access denied. Admin account required.");
        return;
      }

      console.log("✅ Admin verified, saving to localStorage");
      
      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("isAdmin", "true");

      console.log("✅ Admin login successful, redirecting to dashboard");
      toast.success("Admin login successful!");
      setTimeout(() => navigate("/admin-dashboard"), 600);
    } catch (err) {
      console.error("❌ Admin login error:", err);
      console.error("Error message:", err.response?.data?.message);
      console.error("Full error:", err.response?.data);
      toast.error(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-login-page">
      <div className="admin-login-container">
        {/* Left Side - Branding */}
        <div className="admin-login-brand">
          <div className="admin-logo-section">
            <div className="admin-logo-icon">♻️</div>
            <h1>EcoCycle</h1>
            <p>Admin Dashboard</p>
          </div>
          <div className="admin-features">
            <div className="feature-item">
              <span className="feature-icon">📊</span>
              <p>Monitor System</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">👥</span>
              <p>Manage Users</p>
            </div>
            <div className="feature-item">
              <span className="feature-icon">A</span>
              <p>View Analytics</p>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="admin-login-form-section">
          <div className="admin-login-card">
            <h2>Admin Login</h2>
            <p className="subtitle">Sign in to access the admin dashboard</p>

            <form onSubmit={handleSubmit}>
              {/* Email Field */}
              <div className="form-group">
                <label htmlFor="email">Email Address</label>
                <div className="input-wrapper">
                  <span className="input-icon">📧</span>
                  <input
                    type="email"
                    id="email"
                    name="email"
                    placeholder="Enter your admin email"
                    value={form.email}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="form-group">
                <label htmlFor="password">Password</label>
                <div className="input-wrapper">
                  <span className="input-icon">🔒</span>
                  <input
                    type={showPassword ? "text" : "password"}
                    id="password"
                    name="password"
                    placeholder="Enter your password"
                    value={form.password}
                    onChange={handleChange}
                    required
                    disabled={loading}
                  />
                  <button
                    type="button"
                    className="toggle-password"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? "👁️" : "👁️‍🗨️"}
                  </button>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="admin-login-btn"
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className="spinner"></span>
                    Logging in...
                  </>
                ) : (
                  <>
                    <span>🔓</span>
                    Sign In to Dashboard
                  </>
                )}
              </button>
            </form>

            {/* Demo Credentials */}
            <div className="demo-credentials">
              <div className="demo-header">
                <span className="demo-icon">ℹ️</span>
                <span>Demo Credentials</span>
              </div>
              <p>
                <strong>Email:</strong> admin@ecocycle.com
              </p>
              <p>
                <strong>Password:</strong> Admin@123
              </p>
            </div>

            {/* Links */}
            <div className="admin-login-footer">
              <Link to="/" className="back-link">
                ← Back to Home
              </Link>
              <span className="divider">|</span>
              <Link to="/login" className="user-login-link">
                User Login →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AdminLogin;
