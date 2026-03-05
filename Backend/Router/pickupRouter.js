import express from "express";
import verifyToken from "../Middleware/auth.js";
import adminVerifyToken from "../Middleware/adminAuth.js";
import { validatePickupRequest } from "../Middleware/validation.js";
import {
  requestPickup,
  getMyPickups,
  getPickupById,
  cancelPickup,
  getAllPickups,
  assignDriver,
  updatePickupStatus,
  getPickupStats,
} from "../Controller/pickupController.js";

const router = express.Router();

// ================= USER ROUTES =================

// Request pickup
router.post("/request", verifyToken, validatePickupRequest, requestPickup);

// User pickup history
router.get("/my-pickups", verifyToken, getMyPickups);

// Get pickup details
router.get("/:pickupId", verifyToken, getPickupById);

// Cancel pickup
router.put("/cancel/:pickupId", verifyToken, cancelPickup);

// ================= ADMIN ROUTES =================

// Get all pickup requests
router.get("/admin/all", adminVerifyToken, getAllPickups);

// Pickup statistics
router.get("/admin/stats", adminVerifyToken, getPickupStats);

// Assign driver to pickup
router.put("/admin/assign/:pickupId", adminVerifyToken, assignDriver);

// Update pickup status
router.put("/admin/status/:pickupId", adminVerifyToken, updatePickupStatus);

export default router;