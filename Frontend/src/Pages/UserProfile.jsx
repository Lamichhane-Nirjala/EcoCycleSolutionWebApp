import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import { useNavigate } from "react-router-dom";
import { Sidebar } from "../components/Sidebar";
import "../style/UserProfile.css";

const UserProfile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("info");

  const [formData, setFormData] = useState({
    username: "",
    email: "",
    number: "",
    city: "",
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const menuItems = [
    { icon: "🏠", label: "Dashboard", href: "/dashboard" },
    { icon: "👤", label: "Profile", href: "/profile" },
    { icon: "♻️", label: "Waste Tracker", href: "/waste-tracker" },
    { icon: "🚚", label: "Schedule Pickup", href: "/schedule-pickup" },
    { icon: "📊", label: "Analytics", href: "/analytics" },
    { icon: "🏆", label: "Leaderboard", href: "/leaderboard" },
    { icon: "🎁", label: "Rewards", href: "/rewards" },
    { icon: "🔔", label: "Notifications", href: "/notifications" },
  ];

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/me");

      if (response.data.success) {
        const userData = response.data.data;
        setUser(userData);
        setFormData({
          username: userData.name || userData.username || "",
          email: userData.email || "",
          number: userData.phone || userData.number || "",
          city: userData.city || "",
        });
      }
    } catch (error) {
      console.error("Error fetching profile:", error);
      setMessage("Failed to load profile. Please try again.");
      setMessageType("error");
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:5000/api/auth/${user.id}`,
        {
          username: formData.username,
          email: formData.email,
          number: formData.number,
          city: formData.city,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (response.data.success) {
        setUser(response.data.data);
        setEditing(false);
        setMessage("✅ Profile updated successfully!");
        setMessageType("success");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      setMessage(
        error.response?.data?.message || "Failed to update profile"
      );
      setMessageType("error");
    }
  };

  const handleDeleteAccount = async () => {
    try {
      const response = await api.delete(
        `/auth/${user.id}`
      );

      if (response.data.success) {
        setMessage("✅ Account deleted successfully. Redirecting...");
        setMessageType("success");
        setTimeout(() => {
          localStorage.removeItem("token");
          localStorage.removeItem("user");
          navigate("/login");
        }, 2000);
      }
    } catch (error) {
      console.error("Error deleting account:", error);
      setMessage(
        error.response?.data?.message || "Failed to delete account"
      );
      setMessageType("error");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
  };

  if (loading) {
    return (
      <div className="profile-container">
        <Sidebar items={menuItems} userInfo={user} onLogout={handleLogout} />
        <div className="profile-content">
          <div className="loading">Loading your profile...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-container">
        <Sidebar items={menuItems} userInfo={user} onLogout={handleLogout} />
        <div className="profile-content">
          <div className="error">User data not found. Please login again.</div>
        </div>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <Sidebar items={menuItems} userInfo={user} onLogout={handleLogout} />

      <div className="profile-content">
        <div className="profile-header">
          <h1>👤 My Profile</h1>
          <p>Manage your account information</p>
        </div>

        {message && (
          <div className={`message-box ${messageType}`}>
            {message}
          </div>
        )}

        <div className="profile-card">
          <div className="profile-info-header">
            <div className="user-avatar-large">
              {user.name?.charAt(0).toUpperCase() || user.username?.charAt(0).toUpperCase() || "U"}
            </div>
            <div className="user-info-summary">
              <h2>{user.name || user.username}</h2>
              <p>{user.email}</p>
            </div>
            {!editing && (
              <button
                className="edit-btn"
                onClick={() => setEditing(true)}
              >
                ✏️ Edit Profile
              </button>
            )}
          </div>

          {!editing ? (
            <div className="profile-display">
              <div className="profile-field">
                <label>Full Name</label>
                <p>{user.name || user.username || "Not provided"}</p>
              </div>
              <div className="profile-field">
                <label>Email Address</label>
                <p>{user.email}</p>
              </div>
              <div className="profile-field">
                <label>Phone Number</label>
                <p>{user.phone || user.number || "Not provided"}</p>
              </div>
              <div className="profile-field">
                <label>City</label>
                <p>{user.city || "Not provided"}</p>
              </div>
              {user.usertype && (
                <div className="profile-field">
                  <label>Account Type</label>
                  <p className="account-badge">{user.usertype}</p>
                </div>
              )}
            </div>
          ) : (
            <form onSubmit={handleUpdateProfile} className="profile-form">
              <div className="form-group">
                <label htmlFor="username">Full Name *</label>
                <input
                  type="text"
                  id="username"
                  name="username"
                  value={formData.username}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="email">Email Address *</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div className="form-group">
                <label htmlFor="number">Phone Number</label>
                <input
                  type="tel"
                  id="number"
                  name="number"
                  value={formData.number}
                  onChange={handleInputChange}
                  placeholder="e.g., +91 9876543210"
                />
              </div>

              <div className="form-group">
                <label htmlFor="city">City</label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  placeholder="e.g., New Delhi"
                />
              </div>

              <div className="form-actions">
                <button type="submit" className="save-btn">
                  💾 Save Changes
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setEditing(false);
                    setFormData({
                      username: user.name || user.username || "",
                      email: user.email || "",
                      number: user.phone || user.number || "",
                      city: user.city || "",
                    });
                  }}
                >
                  ✕ Cancel
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Account Settings */}
        <div className="account-settings">
          <h3>⚙️ Account Settings</h3>

          <div className="settings-group">
            <div className="setting-item">
              <div className="setting-info">
                <h4>Change Password</h4>
                <p>Update your password to keep your account secure</p>
              </div>
              <button
                className="change-btn"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </button>
            </div>

            <div className="setting-item danger">
              <div className="setting-info">
                <h4>Delete Account</h4>
                <p>Permanently delete your account and all associated data</p>
              </div>
              <button
                className="delete-btn"
                onClick={() => setShowDeleteModal(true)}
              >
                Delete Account
              </button>
            </div>
          </div>
        </div>

        {/* Delete Confirmation Modal */}
        {showDeleteModal && (
          <div className="modal-overlay" onClick={() => setShowDeleteModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Delete Account</h3>
              <p>
                Are you sure you want to permanently delete your account? This action cannot be undone.
              </p>
              <div className="modal-actions">
                <button
                  className="cancel-btn"
                  onClick={() => setShowDeleteModal(false)}
                >
                  Cancel
                </button>
                <button
                  className="delete-btn"
                  onClick={() => {
                    handleDeleteAccount();
                    setShowDeleteModal(false);
                  }}
                >
                  Yes, Delete My Account
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Password Change Modal */}
        {showPasswordModal && (
          <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
            <div className="modal" onClick={(e) => e.stopPropagation()}>
              <h3>Change Password</h3>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  alert("Password change requires additional security verification. Coming soon!");
                  setShowPasswordModal(false);
                }}
              >
                <div className="form-group">
                  <label htmlFor="currentPassword">Current Password *</label>
                  <input
                    type="password"
                    id="currentPassword"
                    name="currentPassword"
                    value={passwordData.currentPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="newPassword">New Password *</label>
                  <input
                    type="password"
                    id="newPassword"
                    name="newPassword"
                    value={passwordData.newPassword}
                    onChange={handlePasswordChange}
                    placeholder="Min 6 characters"
                    required
                  />
                </div>

                <div className="form-group">
                  <label htmlFor="confirmPassword">Confirm New Password *</label>
                  <input
                    type="password"
                    id="confirmPassword"
                    name="confirmPassword"
                    value={passwordData.confirmPassword}
                    onChange={handlePasswordChange}
                    required
                  />
                </div>

                <div className="modal-actions">
                  <button
                    type="button"
                    className="cancel-btn"
                    onClick={() => setShowPasswordModal(false)}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="save-btn">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserProfile;
