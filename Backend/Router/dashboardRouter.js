import express from "express";
import { getDashboard, getPublicLeaderboard } from "../Controller/dashboardController.js";
import verifyToken from "../Middleware/auth.js";

const router = express.Router();

// GET DASHBOARD DATA
router.get("/", verifyToken, getDashboard);

// GET PUBLIC LEADERBOARD DATA (no admin auth required)
router.get("/leaderboard", verifyToken, getPublicLeaderboard);

export default router;