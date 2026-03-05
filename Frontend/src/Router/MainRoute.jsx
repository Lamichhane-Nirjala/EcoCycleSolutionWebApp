import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home";
import HowItWorks from "../Pages/HowItWorks";
import Impact from "../Pages/Impact";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import ForgotPassword from "../Pages/ForgotPassword";

// Modern User Pages
import ModernDashboard from "../Pages/ModernDashboard";
import ModernWasteTracker from "../Pages/ModernWasteTracker";
import ModernPickupScheduler from "../Pages/ModernPickupScheduler";
import ModernRewards from "../Pages/ModernRewards";
import ModernLeaderboard from "../Pages/ModernLeaderboard";
import WasteScanner from "../Pages/WasteScanner";
import WasteAnalytics from "../Pages/WasteAnalytics";
import Ratings from "../Pages/Ratings";
import Notifications from "../Pages/Notifications";
import UserProfile from "../Pages/UserProfile";

// Modern Admin Pages
import AdminLogin from "../Pages/AdminLogin";
import AdminDashboard from "../Pages/AdminDashboard";
import AdminUserManagement from "../Pages/AdminUserManagement";
import AdminPickups from "../Pages/AdminPickups";
import AdminDriverManagement from "../Pages/AdminDriverManagement";
import AdminAnalytics from "../Pages/AdminAnalytics";
import EnvironmentalImpact from "../Pages/EnvironmentalImpact";

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
      <Route path="/forgot-password" element={<ForgotPassword />} />

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
      <Route
        path="/ratings/:pickupId"
        element={
          <UserRoute>
            <Ratings />
          </UserRoute>
        }
      />
      <Route
        path="/notifications"
        element={
          <UserRoute>
            <Notifications />
          </UserRoute>
        }
      />
      <Route
        path="/profile"
        element={
          <UserRoute>
            <UserProfile />
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
      <Route
        path="/admin-pickups"
        element={
          <AdminRoute>
            <AdminPickups />
          </AdminRoute>
        }
      />
      <Route
        path="/admin-drivers"
        element={
          <AdminRoute>
            <AdminDriverManagement />
          </AdminRoute>
        }
      />
      <Route
        path="/admin-analytics"
        element={
          <AdminRoute>
            <AdminAnalytics />
          </AdminRoute>
        }
      />
      <Route
        path="/admin-impact"
        element={
          <AdminRoute>
            <EnvironmentalImpact />
          </AdminRoute>
        }
      />

      {/* Redirect unknown routes to home */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}