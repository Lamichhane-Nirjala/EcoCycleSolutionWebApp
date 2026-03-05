import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home";
import HowItWorks from "../Pages/HowItWorks";
import Impact from "../Pages/Impact";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";

// Modern User Pages
import ModernDashboard from "../Pages/ModernDashboard";
import ModernWasteTracker from "../Pages/ModernWasteTracker";
import ModernPickupScheduler from "../Pages/ModernPickupScheduler";
import ModernRewards from "../Pages/ModernRewards";
import ModernLeaderboard from "../Pages/ModernLeaderboard";
import WasteScanner from "../Pages/WasteScanner";
import WasteAnalytics from "../Pages/WasteAnalytics";

// Modern Admin Pages
import AdminLogin from "../Pages/AdminLogin";
import AdminDashboard from "../Pages/AdminDashboard";
import AdminUserManagement from "../Pages/AdminUserManagement";

// Route Guards
import { AdminRoute } from "../routes/AdminRoute";
import UserRoute from "../routes/userRoute";

export default function MainRoute() {
  return (
    <Routes>
      {/* ==================== PUBLIC ROUTES ==================== */}
      <Route path="/" element={<Home />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/impact" element={<Impact />} />
      <Route path="/login" element={<Login />} />
      <Route path="/admin-login" element={<AdminLogin />} />
      <Route path="/signup" element={<Signup />} />

      {/* ==================== USER ROUTES (PROTECTED) ==================== */}
      <Route
        path="/dashboard"
        element={
          <UserRoute>
            <ModernDashboard />
          </UserRoute>
        }
      />
      <Route
        path="/waste-tracker"
        element={
          <UserRoute>
            <ModernWasteTracker />
          </UserRoute>
        }
      />
      <Route
        path="/schedule-pickup"
        element={
          <UserRoute>
            <ModernPickupScheduler />
          </UserRoute>
        }
      />
      <Route
        path="/rewards"
        element={
          <UserRoute>
            <ModernRewards />
          </UserRoute>
        }
      />
      <Route
        path="/leaderboard"
        element={
          <UserRoute>
            <ModernLeaderboard />
          </UserRoute>
        }
      />
      <Route
        path="/waste-scanner"
        element={
          <UserRoute>
            <WasteScanner />
          </UserRoute>
        }
      />
      <Route
        path="/analytics"
        element={
          <UserRoute>
            <WasteAnalytics />
          </UserRoute>
        }
      />

      {/* ==================== ADMIN ROUTES (PROTECTED) ==================== */}
      <Route
        path="/admin-dashboard"
        element={
          <AdminRoute>
            <AdminDashboard />
          </AdminRoute>
        }
      />
      <Route
        path="/admin-users"
        element={
          <AdminRoute>
            <AdminUserManagement />
          </AdminRoute>
        }
      />

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}