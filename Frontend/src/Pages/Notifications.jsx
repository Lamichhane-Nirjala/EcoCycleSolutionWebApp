import React, { useState, useEffect } from "react";
import api from "../../api/axios";
import Header from "../components/Header";
import "../style/Notifications.css";

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [message, setMessage] = useState("");

  const notificationIcons = {
    pickup_requested: "📋",
    pickup_assigned: "🚗",
    pickup_in_progress: "⏳",
    pickup_completed: "✅",
    pickup_cancelled: "❌",
    new_reward: "🎁",
    leaderboard_update: "🏆",
    system_message: "📢",
  };

  useEffect(() => {
    fetchNotifications();
    fetchUnreadCount();
    // Set up auto-refresh every 15 seconds
    const interval = setInterval(() => {
      fetchNotifications();
      fetchUnreadCount();
    }, 15000);
    return () => clearInterval(interval);
  }, []);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const response = await api.get(
        "/notification/all?limit=50&offset=0"
      );

      if (response.data.success) {
        setNotifications(response.data.data);
      }
    } catch (error) {
      console.error("Error fetching notifications:", error);
      setMessage("Failed to load notifications");
    } finally {
      setLoading(false);
    }
  };

  const fetchUnreadCount = async () => {
    try {
      const response = await api.get(
        "/notification/unread-count"
      );

      if (response.data.success) {
        setUnreadCount(response.data.data.unreadCount);
      }
    } catch (error) {
      console.error("Error fetching unread count:", error);
    }
  };

  const handleMarkAsRead = async (notificationId) => {
    try {
      const response = await api.put(
        `/notification/${notificationId}/read`,
        {}
      );

      if (response.data.success) {
        setNotifications(
          notifications.map((n) =>
            n.id === notificationId ? { ...n, isRead: true } : n
          )
        );
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error marking as read:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const response = await api.put(
        "/notification/read-all",
        {}
      );

      if (response.data.success) {
        setNotifications(notifications.map((n) => ({ ...n, isRead: true })));
        setUnreadCount(0);
        setMessage("✅ All notifications marked as read");
        setTimeout(() => setMessage(""), 3000);
      }
    } catch (error) {
      console.error("Error marking all as read:", error);
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      const response = await api.delete(
        `/notification/${notificationId}`
      );

      if (response.data.success) {
        setNotifications(notifications.filter((n) => n.id !== notificationId));
        fetchUnreadCount();
      }
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  const handleClearAll = async () => {
    if (window.confirm("Are you sure you want to clear all notifications?")) {
      try {
        const response = await api.delete(
          "/notification/"
        );

        if (response.data.success) {
          setNotifications([]);
          setUnreadCount(0);
          setMessage("✅ All notifications cleared");
          setTimeout(() => setMessage(""), 3000);
        }
      } catch (error) {
        console.error("Error clearing notifications:", error);
      }
    }
  };

  const filteredNotifications = 
    filter === "all"
      ? notifications
      : notifications.filter((n) => n.type.includes(filter));

  const unreadNotifications = notifications.filter((n) => !n.isRead).length;

  return (
    <div className="notifications-container">
      <Header />
      <div className="notifications-content">
        <div className="notifications-header">
          <h1>🔔 Notifications</h1>
          <div className="notification-stats">
            <span className="unread-badge">
              {unreadCount} Unread
            </span>
          </div>
        </div>

        {message && <div className="message-box">{message}</div>}

        {/* Action Buttons */}
        <div className="notification-actions">
          <button
            className="action-btn primary"
            onClick={handleMarkAllAsRead}
            disabled={unreadCount === 0}
          >
            Mark All as Read
          </button>
          <button
            className="action-btn danger"
            onClick={handleClearAll}
            disabled={notifications.length === 0}
          >
            Clear All
          </button>
        </div>

        {/* Filter Tabs */}
        <div className="notification-filters">
          <button
            className={`filter-tab ${filter === "all" ? "active" : ""}`}
            onClick={() => setFilter("all")}
          >
            All ({notifications.length})
          </button>
          <button
            className={`filter-tab ${
              filter === "pickup" ? "active" : ""
            }`}
            onClick={() => setFilter("pickup")}
          >
            Pickups
          </button>
          <button
            className={`filter-tab ${
              filter === "reward" ? "active" : ""
            }`}
            onClick={() => setFilter("reward")}
          >
            Rewards
          </button>
          <button
            className={`filter-tab ${
              filter === "system" ? "active" : ""
            }`}
            onClick={() => setFilter("system")}
          >
            System
          </button>
        </div>

        {/* Notifications List */}
        <div className="notifications-list">
          {loading ? (
            <div className="loading">Loading notifications...</div>
          ) : filteredNotifications.length === 0 ? (
            <div className="no-notifications">
              <span className="emoji">📭</span>
              <p>No notifications yet</p>
            </div>
          ) : (
            filteredNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`notification-item ${
                  !notification.isRead ? "unread" : ""
                }`}
              >
                <div className="notification-icon">
                  {notificationIcons[notification.type] || "📬"}
                </div>
                <div className="notification-content">
                  <h3 className="notification-title">{notification.title}</h3>
                  <p className="notification-message">
                    {notification.message}
                  </p>
                  <span className="notification-time">
                    {new Date(notification.createdAt).toLocaleString()}
                  </span>
                </div>
                <div className="notification-actions-item">
                  {!notification.isRead && (
                    <button
                      className="action-small"
                      onClick={() => handleMarkAsRead(notification.id)}
                      title="Mark as read"
                    >
                      ✓
                    </button>
                  )}
                  <button
                    className="action-small delete"
                    onClick={() => handleDeleteNotification(notification.id)}
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Notifications;
