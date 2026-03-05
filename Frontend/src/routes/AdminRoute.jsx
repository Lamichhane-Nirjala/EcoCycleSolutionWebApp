import React from "react";
import { Navigate } from "react-router-dom";

/**
 * AdminRoute Component - Protects admin pages
 * Only allows users with "Admin" usertype to access
 */
export function AdminRoute({ children }) {
  // Get user data from localStorage
  const userStr = localStorage.getItem("user");
  const user = userStr ? JSON.parse(userStr) : null;
  const token = localStorage.getItem("token");
  const isAdmin = localStorage.getItem("isAdmin");

  // Check if user is authenticated, is admin, and has valid token
  if (!token || !user) {
    // No token or user data - redirect to login page (same for users and admins)
    return <Navigate to="/login" replace />;
  }

  if (user.usertype !== "Admin" || isAdmin !== "true") {
    // User is not admin - redirect to user dashboard
    return <Navigate to="/dashboard" replace />;
  }

  // User is authenticated admin - allow access
  return children;
}

export default AdminRoute;
