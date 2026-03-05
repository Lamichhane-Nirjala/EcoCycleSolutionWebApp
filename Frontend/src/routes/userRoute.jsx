import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

/**
 * User Route Protection
 * Checks if user is authenticated and is a regular user (not admin)
 */
const UserRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  const user = localStorage.getItem("user");
  const isAdmin = localStorage.getItem("isAdmin");

  // No token - redirect to login
  if (!token) {
    toast.error("Please login to access this page");
    return <Navigate to="/login" />;
  }

  // User is admin - redirect to admin dashboard
  if (isAdmin === "true") {
    toast.error("This page is for regular users only");
    return <Navigate to="/admin-dashboard" />;
  }

  // User is authenticated and not admin - allow access
  return children;
};

export default UserRoute;
