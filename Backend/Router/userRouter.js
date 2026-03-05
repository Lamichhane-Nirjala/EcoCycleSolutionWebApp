import express from "express";
import {
  registerUser,
  loginUser,
  getLoggedInUser,
  getalluser,
  getUserbyid,
  updateUser,
  deleteUser,
  forgotPassword,
  resetPassword,
} from "../Controller/userController.js";

import verifyToken from "../Middleware/auth.js";
import { validateRegister, validateLogin, validateUpdateUser } from "../Middleware/validation.js";

const router = express.Router();

// REGISTER USER
router.post("/create", validateRegister, registerUser);

// LOGIN USER
router.post("/login", validateLogin, loginUser);

// DASHBOARD USER (Get current user info)
router.get("/me", verifyToken, getLoggedInUser);

// GET ALL USERS (protected)
router.get("/all", verifyToken, getalluser);

// GET USER BY ID (protected)
router.get("/:id", verifyToken, getUserbyid);

// UPDATE USER (protected)
router.put("/:id", verifyToken, validateUpdateUser, updateUser);

// DELETE USER (protected)
router.delete("/:id", verifyToken, deleteUser);

// FORGOT PASSWORD
router.post("/forgot-password", forgotPassword);

// RESET PASSWORD
router.post("/reset-password", resetPassword);

export default router;