import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../Model/userModel.js";
import { logActivity } from "./activityController.js";

const JWT_SECRET = process.env.JWT_SECRET || "your_secret_key";
const JWT_EXPIRE = "7d";

// REGISTER USER
export const registerUser = async (req, res) => {
  try {
    const { name, email, password, phone, city, userType } = req.body;

    // Check existing user
    const exists = await User.findOne({ where: { email } });
    if (exists) {
      return res.status(400).json({
        success: false,
        message: "Email already registered",
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      username: name,
      email,
      password: hashedPassword,
      number: phone,
      city,
      usertype: userType || "User",
    });

    // Log activity
    await logActivity(user.id, "signup", `User registered: ${email}`, null, null, {
      email: user.email,
    });

    const token = jwt.sign(
      { id: user.id, email: user.email, usertype: user.usertype },
      JWT_SECRET,
      { expiresIn: JWT_EXPIRE }
    );

    res.status(201).json({
      success: true,
      message: "User registered successfully",
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        usertype: user.usertype,
      },
    });
  } catch (error) {
    console.error("Register error:", error);
    res.status(500).json({
      success: false,
      message: "Registration failed",
      error: error.message,
    });
  }
};

// GET ALL USERS
export const getalluser = async (req, res) => {
  try {
    const users = await User.findAll({
      attributes: { exclude: ["password"] },
      order: [["createdAt", "DESC"]],
    });

    res.status(200).json({
      success: true,
      message: "Users fetched successfully",
      data: users,
    });
  } catch (err) {
    console.error("Get all users error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch users",
      error: err.message,
    });
  }
};

//GET USER BY ID 
export const getUserbyid = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: user,
    });
  } catch (err) {
    console.error("Get user by ID error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: err.message,
    });
  }
};

//UPDATE USER 
export const updateUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Prevent password change from here (separate endpoint should handle password reset)
    const { password, usertype, ...updateData } = req.body;

    await user.update(updateData);

    // Log activity
    await logActivity(user.id, "profile_update", "User profile updated", null, null, {
      updatedFields: Object.keys(updateData),
    });

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      data: user,
    });
  } catch (err) {
    console.error("Update user error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to update user",
      error: err.message,
    });
  }
};

// DELETE USER 
export const deleteUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userId = user.id;
    const userEmail = user.email;

    await user.destroy();

    // Log activity
    await logActivity(userId, "account_delete", `Account deleted: ${userEmail}`, null, null, {
      email: userEmail,
    });

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (err) {
    console.error("Delete user error:", err);
    res.status(500).json({
      success: false,
      message: "Failed to delete user",
      error: err.message,
    });
  }
};

//LOGIN 
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const token = jwt.sign(
      {
        id: user.id,
        email: user.email,
        usertype: user.usertype,
      },
      JWT_SECRET,
      { expiresIn: "1d" }
    );

    // Log activity
    await logActivity(user.id, "login", `Login successful: ${email}`, null, null, {
      email: user.email,
    });

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      user: {
        id: user.id,
        name: user.username,
        email: user.email,
        usertype: user.usertype,
      },
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      success: false,
      message: "Login failed",
      error: error.message,
    });
  }
};
// GET LOGGED-IN USER (DASHBOARD) 
export const getLoggedInUser = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ["password"] },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User fetched successfully",
      data: {
        id: user.id,
        name: user.username,
        email: user.email,
        usertype: user.usertype,
        phone: user.number,
        city: user.city,
      },
    });
  } catch (error) {
    console.error("Get logged-in user error:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch user",
      error: error.message,
    });
  }
};
