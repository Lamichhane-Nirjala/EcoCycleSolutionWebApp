import { Routes, Route, Navigate } from "react-router-dom";

import Home from "../Pages/Home";
import HowItWorks from "../Pages/HowItWorks";
import Impact from "../Pages/Impact";
import Rewards from "../Pages/Rewards";
import Login from "../Pages/Login";
import Signup from "../Pages/Signup";
import Dashboard from "../Pages/Dashboard";

export default function MainRoute() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/how-it-works" element={<HowItWorks />} />
      <Route path="/impact" element={<Impact />} />
      <Route path="/rewards" element={<Rewards />} />
      <Route path="/login" element={<Login />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/dashboard" element={<Dashboard />} />

      {/* Redirect unknown routes */}
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}
