import express from "express";
import {
  getActivityLog,
  getAllActivityLog,
  getActivityStats,
} from "../Controller/activityController.js";
import verifyToken from "../Middleware/auth.js";
import verifyAdmin from "../Middleware/adminAuth.js";

const router = express.Router();

// Get activity log for a user (user can see own, admin can see any)
router.get("/user/:userId", verifyToken, getActivityLog);

// Get all activities (admin only)
router.get("/admin/all", verifyToken, verifyAdmin, getAllActivityLog);

// Get activity statistics (admin only)
router.get("/admin/stats", verifyToken, verifyAdmin, getActivityStats);

export default router;
