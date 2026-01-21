import express from "express";
import cors from "cors";

import { createUploadsFolder } from "./security/helper.js";
import userRouter from "./Router/userRouter.js";
import { connection } from "./Database/db.js";

const app = express();
const PORT = 5000;

// Middleware
app.use(express.json());

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
      "http://localhost:5175",
    ],
    credentials: true,
  })
);

// Routes
app.use("/auth", userRouter);

// Startup function (CRITICAL FIX)
const startServer = async () => {
  try {
    await connection(); // ✅ WAIT for DB
    createUploadsFolder();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Server failed to start:", error);
    process.exit(1);
  }
};

startServer();

// 🔥 Global crash protection (MANDATORY)
process.on("unhandledRejection", (err) => {
  console.error("Unhandled Rejection:", err);
});

process.on("uncaughtException", (err) => {
  console.error("Uncaught Exception:", err);
});
