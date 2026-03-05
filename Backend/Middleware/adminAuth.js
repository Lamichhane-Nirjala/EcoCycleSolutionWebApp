import jwt from "jsonwebtoken";
import User from "../Model/userModel.js";

// Verify token and check admin privileges
const adminVerifyToken = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.log("❌ adminVerifyToken: No authorization header");
      return res.status(401).json({
        success: false,
        message: "Authorization token missing",
      });
    }

    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    console.log("✅ adminVerifyToken: Token decoded, userId:", decoded.id);

    // Fetch user from database to check usertype
    const user = await User.findByPk(decoded.id);

    if (!user) {
      console.log("❌ adminVerifyToken: User not found in database, userId:", decoded.id);
      return res.status(401).json({
        success: false,
        message: "User not found",
      });
    }

    console.log("📊 adminVerifyToken: User found:", {
      id: user.id,
      email: user.email,
      usertype: user.usertype,
      usertypeType: typeof user.usertype,
    });

    // Check if user is admin
    if (user.usertype !== "Admin") {
      console.log(
        "❌ adminVerifyToken: User is not admin. UserType:",
        user.usertype,
        "Expected: Admin"
      );
      return res.status(403).json({
        success: false,
        message: "Unauthorized: Admin access required",
      });
    }

    console.log("✅ adminVerifyToken: Admin verified!");

    // Attach user to request
    req.user = {
      id: decoded.id,
      usertype: user.usertype,
    };

    next();
  } catch (error) {
    console.error("❌ adminVerifyToken error:", error.message);
    return res.status(401).json({
      success: false,
      message: "Invalid or expired token",
    });
  }
};

export default adminVerifyToken;
