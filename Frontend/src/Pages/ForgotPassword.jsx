import React, { useState } from "react";
import api from "../../api/axios";
import { useNavigate, Link } from "react-router-dom";
import Header from "../components/Header";
import "../style/ForgotPassword.css";

const ForgotPassword = () => {
  const [step, setStep] = useState("email"); // email, token, password
  const [email, setEmail] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");
  const navigate = useNavigate();

  const handleRequestReset = async (e) => {
    e.preventDefault();
    if (!email) {
      setMessage("Please enter your email address");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        "/auth/forgot-password",
        { email }
      );

      if (response.data.success) {
        setResetToken(response.data.token);
        setMessage("✅ Reset token generated successfully! (Token copied to clipboard)");
        setMessageType("success");
        // Copy token to clipboard for easier testing
        navigator.clipboard.writeText(response.data.token);
        setTimeout(() => {
          setStep("token");
          setMessage("");
        }, 2000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to request password reset"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();

    if (!resetToken) {
      setMessage("Please enter the reset token");
      setMessageType("error");
      return;
    }

    if (!newPassword || !confirmPassword) {
      setMessage("Please enter both passwords");
      setMessageType("error");
      return;
    }

    if (newPassword !== confirmPassword) {
      setMessage("Passwords do not match");
      setMessageType("error");
      return;
    }

    if (newPassword.length < 6) {
      setMessage("Password must be at least 6 characters long");
      setMessageType("error");
      return;
    }

    try {
      setLoading(true);
      const response = await api.post(
        "/auth/reset-password",
        {
          token: resetToken,
          newPassword,
          confirmPassword,
        }
      );

      if (response.data.success) {
        setMessage("✅ Password reset successfully! Redirecting to login...");
        setMessageType("success");
        setTimeout(() => {
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      setMessage(
        error.response?.data?.message || "Failed to reset password"
      );
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="forgot-password-page">
      <Header />
      <div className="forgot-password-container">
        <div className="forgot-password-card">
          <div className="card-header">
            <h1>Reset Your Password</h1>
            <p>Secure your account with a new password</p>
          </div>

          {message && (
            <div className={`message-box ${messageType}`}>
              {message}
            </div>
          )}

          <div className="steps-indicator">
            <div className={`step ${step === "email" || step === "token" || step === "password" ? "active" : ""}`}>
              <span className="step-number">1</span>
              <span className="step-label">Email</span>
            </div>
            <div className={`step-line ${(step === "token" || step === "password") ? "completed" : ""}`}></div>
            <div className={`step ${step === "token" || step === "password" ? "active" : ""}`}>
              <span className="step-number">2</span>
              <span className="step-label">Token</span>
            </div>
            <div className={`step-line ${step === "password" ? "completed" : ""}`}></div>
            <div className={`step ${step === "password" ? "active" : ""}`}>
              <span className="step-number">3</span>
              <span className="step-label">Password</span>
            </div>
          </div>

          {/* Step 1: Email */}
          {step === "email" && (
            <form onSubmit={handleRequestReset} className="form">
              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your registered email"
                  required
                />
              </div>
              <button type="submit" className="submit-btn" disabled={loading}>
                {loading ? "Sending..." : "Send Reset Link"}
              </button>
            </form>
          )}

          {/* Step 2: Token */}
          {step === "token" && (
            <form onSubmit={(e) => { e.preventDefault(); setStep("password"); }} className="form">
              <div className="form-group">
                <label htmlFor="token">Reset Token *</label>
                <textarea
                  id="token"
                  value={resetToken}
                  onChange={(e) => setResetToken(e.target.value)}
                  placeholder="Paste your reset token here"
                  rows="4"
                  required
                ></textarea>
                <p className="help-text">
                  The reset token has been sent to your email. Copy and paste it here. (For testing, the token is automatically copied to clipboard)
                </p>
              </div>
              <div className="form-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => {
                    setStep("email");
                    setResetToken("");
                  }}
                >
                  Back
                </button>
                <button type="submit" className="submit-btn">
                  Verify Token
                </button>
              </div>
            </form>
          )}

          {/* Step 3: New Password */}
          {step === "password" && (
            <form onSubmit={handleResetPassword} className="form">
              <div className="form-group">
                <label htmlFor="newPassword">New Password *</label>
                <input
                  type="password"
                  id="newPassword"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  placeholder="Enter new password (min 6 characters)"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="confirmPassword">Confirm Password *</label>
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  placeholder="Confirm new password"
                  required
                />
              </div>
              <p className="password-info">
                ✓ Password must be at least 6 characters long
              </p>
              <div className="form-actions">
                <button
                  type="button"
                  className="back-btn"
                  onClick={() => setStep("token")}
                >
                  Back
                </button>
                <button type="submit" className="submit-btn" disabled={loading}>
                  {loading ? "Resetting..." : "Reset Password"}
                </button>
              </div>
            </form>
          )}

          <div className="form-footer">
            <p>Remember your password? <Link to="/login">Login here</Link></p>
            <p>Don't have an account? <Link to="/signup">Sign up</Link></p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
