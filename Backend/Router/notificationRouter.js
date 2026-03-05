import express from "express";
import auth from "../Middleware/auth.js";
import {
  getUserNotifications,
  getUnreadCount,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  clearAllNotifications,
} from "../Controller/notificationController.js";

const notificationRouter = express.Router();

// Get user's notifications
notificationRouter.get("/all", auth, getUserNotifications);

// Get unread notifications count
notificationRouter.get("/unread-count", auth, getUnreadCount);

// Mark notification as read
notificationRouter.put("/:notificationId/read", auth, markAsRead);

// Mark all notifications as read
notificationRouter.put("/read-all", auth, markAllAsRead);

// Delete notification
notificationRouter.delete("/:notificationId", auth, deleteNotification);

// Clear all notifications
notificationRouter.delete("/", auth, clearAllNotifications);

export default notificationRouter;
