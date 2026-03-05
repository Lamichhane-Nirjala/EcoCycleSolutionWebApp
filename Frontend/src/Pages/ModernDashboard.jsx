import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card, AnalyticsCard } from "../components/Card";
import { Button } from "../components/Button";
import { LoadingPage } from "../components/Loader";
import { Link } from "react-router-dom";
import api from "../../api/axios";
import "../style/ModernDashboard.css";

export default function ModernDashboard() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [recentPickups, setRecentPickups] = useState([]);
  const [wasteBreakdown, setWasteBreakdown] = useState([]);
  const [error, setError] = useState(null);

  const menuItems = [
    { icon: "🏠", label: "Dashboard", href: "/dashboard" },
    { icon: "👤", label: "Profile", href: "/profile" },
    { icon: "♻️", label: "Waste Tracker", href: "/waste-tracker" },
    { icon: "🚚", label: "Schedule Pickup", href: "/schedule-pickup" },
    { icon: "📊", label: "Analytics", href: "/analytics" },
    { icon: "🏆", label: "Leaderboard", href: "/leaderboard" },
    { icon: "🎁", label: "Rewards", href: "/rewards" },
    { icon: "🔔", label: "Notifications", href: "/notifications" },
  ];

  useEffect(() => {
    fetchDashboardData();
    
    // Auto-refresh dashboard data every 30 seconds
    const refreshInterval = setInterval(fetchDashboardData, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/dashboard/");
      
      if (response.data.success) {
        const data = response.data.data;
        setUser(data.user);
        setStats(data.stats);
        setRecentPickups(data.recentPickups || []);
        setWasteBreakdown(data.wasteTypeBreakdown || []);
        
        // Store user in localStorage for sidebar
        localStorage.setItem("user", JSON.stringify(data.user));
        toast.success("Dashboard loaded successfully");
      } else {
        const errorMsg = response.data.message || "Failed to load dashboard";
        setError(errorMsg);
        toast.error(errorMsg);
      }
    } catch (err) {
      console.error("Dashboard error:", err);
      
      // Handle authentication errors
      if (err.response?.status === 401) {
        const errorMsg = "Your session has expired. Please login again.";
        setError(errorMsg);
        toast.error(errorMsg);
        setTimeout(() => window.location.href = "/login", 1500);
        return;
      }
      
      // Handle other errors
      const errorMsg = err.response?.data?.message || err.message || "Failed to load dashboard. Please try again.";
      setError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage message="Loading your dashboard..." />;

  if (!user) {
    return (
      <div className="error-container">
        <h2>Authentication Required</h2>
        <p>Please log in to access your dashboard.</p>
        <Link to="/login">
          <Button variant="primary">Go to Login</Button>
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="error-container">
        <h2>Error Loading Dashboard</h2>
        <p>{error}</p>
        <Button variant="primary" onClick={fetchDashboardData}>
          Try Again
        </Button>
      </div>
    );
  }

  const firstName = user.name?.split(" ")[0] || "User";

  return (
    <div className="dashboard-layout">
      <Sidebar items={menuItems} userInfo={user} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title={`Welcome back, ${firstName}!`}
          subtitle="Here's your waste management overview"
        />

        <PageContainer>
          {/* Analytics Cards */}
          <div className="analytics-grid">
            <AnalyticsCard
              label="Total Waste Tracked"
              value={(stats?.totalWaste || 0).toFixed(1)}
              unit="kg"
              color="#4ade80"
              icon="♻️"
            />
            <AnalyticsCard
              label="Eco Points Earned"
              value={stats?.ecoPoints || 0}
              unit="pts"
              color="#06b6d4"
              icon="⭐"
            />
            <AnalyticsCard
              label="Pickups Completed"
              value={stats?.statusBreakdown?.Completed || 0}
              unit="pickups"
              color="#f59e0b"
              icon="✅"
            />
            <AnalyticsCard
              label="Pending Pickups"
              value={stats?.statusBreakdown?.Pending || 0}
              unit="pickups"
              color="#ef4444"
              icon="⏳"
            />
          </div>

          {/* Quick Actions */}
          <div className="section">
            <h2 className="section-title">Quick Actions</h2>
            <div className="action-buttons">
              <Link to="/schedule-pickup">
                <Button variant="primary" size="lg" icon="🚚">
                  Schedule Pickup
                </Button>
              </Link>
              <Link to="/waste-tracker">
                <Button variant="secondary" size="lg" icon="♻️">
                  Track Waste
                </Button>
              </Link>
              <Link to="/rewards">
                <Button variant="secondary" size="lg" icon="🎁">
                  View Rewards
                </Button>
              </Link>
            </div>
          </div>

          {/* Waste Type Breakdown */}
          {wasteBreakdown.length > 0 && (
            <div className="section">
              <h2 className="section-title">Waste Type Breakdown</h2>
              <div className="waste-type-grid">
                {wasteBreakdown.map((item, idx) => (
                  <Card key={idx}>
                    <div style={{ textAlign: "center", padding: "20px" }}>
                      <p style={{ color: "#666", fontSize: "14px" }}>
                        {item.wasteType}
                      </p>
                      <h3 style={{ margin: "8px 0" }}>
                        {item.totalWeight.toFixed(1)} kg
                      </h3>
                      <p style={{ color: "#999", fontSize: "12px" }}>
                        {item.count} pickups
                      </p>
                    </div>
                  </Card>
                ))}
              </div>
            </div>
          )}

          {/* Recent Activity */}
          <div className="section">
            <div className="section-header">
              <h2 className="section-title">Recent Pickups</h2>
              <Link to="/waste-tracker" className="view-all">
                View All →
              </Link>
            </div>

            {recentPickups.length > 0 ? (
              <div className="pickup-list">
                {recentPickups.map((pickup) => (
                  <div key={pickup.pickupId} className="pickup-item">
                    <div className="pickup-info">
                      <p className="pickup-type">{pickup.wasteType}</p>
                      <p className="pickup-address">{pickup.pickupAddress}</p>
                      <p className="pickup-date">
                        {new Date(pickup.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className={`status-badge status-${pickup.status.toLowerCase()}`}>
                      {pickup.status}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="empty-state">
                <p>No pickups scheduled yet</p>
                <Link to="/schedule-pickup">
                  <Button variant="primary">Schedule Your First Pickup</Button>
                </Link>
              </div>
            )}
          </div>
        </PageContainer>
      </main>
    </div>
  );
}

