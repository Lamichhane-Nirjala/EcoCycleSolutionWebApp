// Combined Eco Points Tracker - shows live eco points from dashboard
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card, AnalyticsCard } from "../components/Card";
import { LoadingPage } from "../components/Loader";

export default function EcoPointsTracker() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [user, setUser] = useState(null);

  const menuItems = [
    { icon: "🏠", label: "Dashboard", href: "/dashboard" },
    { icon: "♻️", label: "Waste Tracker", href: "/waste-tracker" },
    { icon: "🚚", label: "Schedule Pickup", href: "/schedule-pickup" },
    { icon: "📊", label: "Analytics", href: "/analytics" },
    { icon: "🏆", label: "Leaderboard", href: "/leaderboard" },
    { icon: "🎁", label: "Rewards", href: "/rewards" },
  ];

  useEffect(() => {
    fetchEcoPoints();
    const refreshInterval = setInterval(fetchEcoPoints, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchEcoPoints = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/");
      
      if (response.data.success) {
        const data = response.data.data;
        setUser(data.user);
        setStats(data.stats);
      }
    } catch (error) {
      console.error("Error fetching eco points:", error);
      toast.error("Failed to load eco points");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage message="Loading your eco points..." />;

  return (
    <div className="dashboard-layout">
      <Sidebar items={menuItems} userInfo={user} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Eco Points Tracker 🌱"
          subtitle="Monitor your environmental contribution"
        />

        <PageContainer>
          <div className="analytics-grid">
            <AnalyticsCard
              label="Eco Points"
              value={stats?.ecoPoints || 0}
              unit="pts"
              color="#4ade80"
              icon="⭐"
            />
            <AnalyticsCard
              label="Total Waste"
              value={(stats?.totalWaste || 0).toFixed(1)}
              unit="kg"
              color="#22c55e"
              icon="♻️"
            />
            <AnalyticsCard
              label="Completed Pickups"
              value={stats?.statusBreakdown?.Completed || 0}
              unit="pickups"
              color="#f59e0b"
              icon="✅"
            />
            <AnalyticsCard
              label="CO₂ Saved"
              value={(((stats?.totalWaste || 0) * 0.21).toFixed(1))}
              unit="kg"
              color="#06b6d4"
              icon="🌍"
            />
          </div>

          <div style={{ textAlign: "center", marginTop: "32px" }}>
            <h3>Great job contributing to a cleaner environment! 🎉</h3>
            <p>Keep tracking and collecting eco points to unlock rewards!</p>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
