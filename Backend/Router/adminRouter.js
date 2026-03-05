import express from "express";
import adminVerifyToken from "../Middleware/adminAuth.js";
import {
  getAdminDashboard,
  getAllUsersAdmin,
  getAllPickupsAdmin,
  deleteUserAdmin,
  getAnalytics,
} from "../Controller/adminController.js";

const router = express.Router();

// Admin Dashboard - Get system-wide stats
router.get("/dashboard", adminVerifyToken, getAdminDashboard);

// Admin Analytics (detailed analytics over time)
router.get("/analytics-detailed", adminVerifyToken, getAnalytics);

// Admin Analytics (legacy - same as dashboard)
router.get("/analytics", adminVerifyToken, getAdminDashboard);

// Get all users
router.get("/users", adminVerifyToken, getAllUsersAdmin);

// Get all pickups
router.get("/pickups", adminVerifyToken, getAllPickupsAdmin);

// Delete user
router.delete("/users/:userId", adminVerifyToken, deleteUserAdmin);

export default router;