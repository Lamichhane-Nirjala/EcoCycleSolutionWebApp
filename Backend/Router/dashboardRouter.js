import express from "express";
import { getDashboard } from "../Controller/dashboardController.js";
import verifyToken from "../Middleware/auth.js";

const router = express.Router();

// GET DASHBOARD DATA
router.get("/", verifyToken, getDashboard);

export default router;