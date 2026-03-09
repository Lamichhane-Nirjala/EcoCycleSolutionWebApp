import express from "express";
import cors from "cors";

import { createUploadsFolder } from "./security/helper.js";
import { connection } from "./Database/db.js";

import userRouter from "./Router/userRouter.js";
import pickupRouter from "./Router/pickupRouter.js";
import adminRouter from "./Router/adminRouter.js";
import dashboardRouter from "./Router/dashboardRouter.js";
import activityRouter from "./Router/activityRouter.js";
import reviewRouter from "./Router/reviewRouter.js";
import notificationRouter from "./Router/notificationRouter.js";

import { errorHandler, notFoundHandler } from "./Middleware/errorHandler.js";

const app = express();
const PORT = 5000;

// Middleware - MUST BE BEFORE ROUTES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
      "http://localhost:5176",
      "http://localhost:5177",
      "http://localhost:5178",
    ],
    credentials: true,
  })
);

// HEALTH CHECK - NO DB NEEDED
app.get("/api/health", (req, res) => {
  res.json({
    success: true,
    status: "Server is running ✅",
    timestamp: new Date(),
  });
});

// ROUTES
app.use("/api/auth", userRouter);
app.use("/api/pickup", pickupRouter);
app.use("/api/admin", adminRouter);
app.use("/api/dashboard", dashboardRouter);
app.use("/api/activity", activityRouter);
app.use("/api/review", reviewRouter);
app.use("/api/notification", notificationRouter);

// 404 Handler - MUST BE BEFORE ERROR HANDLER
app.use(notFoundHandler);

// Error Handler - MUST BE LAST
app.use(errorHandler);

// Start server
const startServer = async () => {
  try {
    console.log(" Connecting to database...");
    await connection();
    console.log("✅ Database connected");
    
    createUploadsFolder();
    console.log("");

    app.listen(PORT, () => {
      console.log(` Server running on port ${PORT}`);
      console.log(`Health check: http://localhost:${PORT}/api/health`);
      console.log(`Login endpoint: POST http://localhost:${PORT}/api/auth/login`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error.message);
    process.exit(1);
  }
};

startServer();