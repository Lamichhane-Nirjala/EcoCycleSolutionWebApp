import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { LoadingPage } from "../components/Loader";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../style/AdminDashboard.css";

export default function AdminDashboard() {
  const [dashboardData, setDashboardData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month"); // week, month, year

  const token = localStorage.getItem("token");

  const adminMenuItems = [
    { icon: "📊", label: "Dashboard", href: "/admin-dashboard" },
    { icon: "👥", label: "Users", href: "/admin-users" },
    { icon: "🚚", label: "Pickups", href: "/admin-dashboard" },
    { icon: "📈", label: "Analytics", href: "/admin-dashboard" },
    { icon: "⚙️", label: "Settings", href: "/admin-dashboard" },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, [timeRange]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Check if user is logged in
      const user = localStorage.getItem("user");
      const token = localStorage.getItem("token");
      const isAdmin = localStorage.getItem("isAdmin");
      
      console.log("📊 AdminDashboard: Checking auth...");
      console.log("   Token exists:", !!token);
      console.log("   User exists:", !!user);
      console.log("   isAdmin flag:", isAdmin);
      
      if (user) {
        const userData = JSON.parse(user);
        console.log("   User type:", userData.usertype);
      }
      
      // Fetch real data from the admin API
      console.log("📊 AdminDashboard: Fetching /admin/dashboard...");
      const response = await api.get("/admin/dashboard");
      
      console.log("✅ AdminDashboard: Response received", response.data);
      
      if (response.data.success) {
        const data = response.data.data;
        
        // Transform API data to dashboard format
        const transformedData = {
          totalUsers: data.totalUsers || 0,
          activeUsers: Math.floor((data.totalUsers || 0) * 0.8), // Estimate 80% active
          totalPickups: data.totalPickups || 0,
          totalWasteCollected: data.totalWaste || 0,
          totalEcoPointsIssued: (data.totalPickups || 0) * 100, // Estimate 100 points per pickup
          monthlyGrowth: {
            users: 0,
            pickups: 0,
            waste: 0,
          },
          pickupsByStatus: data.pickupsByStatus || {},
          recentActivity: data.recentActivity || [],
          topUsers: data.topUsers || [],
          chartData: {
            pickups: [],
            waste: [],
            ecoPoints: [],
          },
        };
        
        setDashboardData(transformedData);
      } else {
        toast.error("Failed to load dashboard data");
      }
    } catch (error) {
      console.error("❌ AdminDashboard fetch error:", error);
      console.error("   Status:", error.response?.status);
      console.error("   Message:", error.response?.data?.message);
      console.error("   Full error:", error.response?.data);
      
      const errorMsg = error.response?.status === 401 
        ? "❌ Unauthorized: Your session has expired or you're not logged in as admin"
        : error.response?.status === 403
        ? "❌ Forbidden: You don't have admin privileges"
        : error.response?.data?.message || error.message || "Failed to load dashboard data";
      
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

  if (loading) return <LoadingPage message="Loading dashboard..." />;

  // Fallback data if API returns no data
  const displayData = dashboardData || {
    totalUsers: 0,
    activeUsers: 0,
    totalPickups: 0,
    totalWasteCollected: 0,
    totalEcoPointsIssued: 0,
    monthlyGrowth: { users: 0, pickups: 0, waste: 0 },
    pickupsByStatus: {},
    recentActivity: [],
    topUsers: [],
    chartData: { pickups: [], waste: [], ecoPoints: [] },
  };

  const activityIcon = (type) => {
    switch (type) {
      case "pickup":
        return "🚚";
      case "user":
        return "👤";
      case "milestone":
        return "🏆";
      default:
        return "📝";
    }
  };

  return (
    <div className="dashboard-layout">
      <Sidebar items={adminMenuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Admin Dashboard 📊"
          subtitle="System Overview and Analytics"
        />

        <PageContainer>
          {/* Time Range Selector */}
          <div className="time-range-selector">
            <button
              className={timeRange === "week" ? "active" : ""}
              onClick={() => setTimeRange("week")}
            >
              Week
            </button>
            <button
              className={timeRange === "month" ? "active" : ""}
              onClick={() => setTimeRange("month")}
            >
              Month
            </button>
            <button
              className={timeRange === "year" ? "active" : ""}
              onClick={() => setTimeRange("year")}
            >
              Year
            </button>
          </div>

          {/* Key Metrics */}
          <div className="metrics-grid">
            <div className="metric-card">
              <div className="metric-icon">👥</div>
              <div className="metric-content">
                <div className="metric-label">Total Users</div>
                <div className="metric-value">{displayData.totalUsers}</div>
                <div className="metric-change">
                  <span className="positive">
                    ↑ {displayData.monthlyGrowth.users}%
                  </span>
                  <span className="text-muted">This month</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">✅</div>
              <div className="metric-content">
                <div className="metric-label">Active Users</div>
                <div className="metric-value">
                  {displayData.activeUsers}
                </div>
                <div className="metric-change">
                  <span className="positive">Active rate</span>
                  <span className="text-muted">
                    {(
                      (displayData.activeUsers / displayData.totalUsers) *
                      100
                    ).toFixed(1)}
                    %
                  </span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🚚</div>
              <div className="metric-content">
                <div className="metric-label">Total Pickups</div>
                <div className="metric-value">
                  {displayData.totalPickups}
                </div>
                <div className="metric-change">
                  <span className="positive">
                    ↑ {displayData.monthlyGrowth.pickups}%
                  </span>
                  <span className="text-muted">This month</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">♻️</div>
              <div className="metric-content">
                <div className="metric-label">Waste Collected</div>
                <div className="metric-value">
                  {displayData.totalWasteCollected.toFixed(1)} kg
                </div>
                <div className="metric-change">
                  <span className="positive">
                    ↑ {displayData.monthlyGrowth.waste}%
                  </span>
                  <span className="text-muted">This month</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🌱</div>
              <div className="metric-content">
                <div className="metric-label">Eco Points Issued</div>
                <div className="metric-value">
                  {displayData.totalEcoPointsIssued.toLocaleString()}
                </div>
                <div className="metric-change">
                  <span className="text-muted">Total points distributed</span>
                </div>
              </div>
            </div>

            <div className="metric-card">
              <div className="metric-icon">🎖️</div>
              <div className="metric-content">
                <div className="metric-label">Avg Points per User</div>
                <div className="metric-value">
                  {Math.round(
                    displayData.totalEcoPointsIssued /
                      displayData.totalUsers
                  )}
                </div>
                <div className="metric-change">
                  <span className="text-muted">Average distribution</span>
                </div>
              </div>
            </div>
          </div>

          <div className="dashboard-sections">
            {/* Pickup Status Overview */}
            <div className="section">
              <div className="section-header">
                <h3>Pickup Status Overview</h3>
              </div>
              <div className="status-overview">
                <div className="status-item">
                  <div className="status-bar completed">
                    <div className="status-fill"></div>
                  </div>
                  <div className="status-label">
                    <span className="status-name">Completed</span>
                    <span className="status-count">
                      {displayData.pickupsByStatus.completed}
                    </span>
                  </div>
                </div>

                <div className="status-item">
                  <div className="status-bar pending">
                    <div className="status-fill"></div>
                  </div>
                  <div className="status-label">
                    <span className="status-name">Pending</span>
                    <span className="status-count">
                      {displayData.pickupsByStatus.pending}
                    </span>
                  </div>
                </div>

                <div className="status-item">
                  <div className="status-bar cancelled">
                    <div className="status-fill"></div>
                  </div>
                  <div className="status-label">
                    <span className="status-name">Cancelled</span>
                    <span className="status-count">
                      {displayData.pickupsByStatus.cancelled}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="section">
              <div className="section-header">
                <h3>Recent Activity</h3>
              </div>
              <div className="activity-feed">
                {displayData.recentActivity.map((activity) => (
                  <div key={activity.id} className="activity-item">
                    <div className="activity-icon">{activityIcon(activity.type)}</div>
                    <div className="activity-content">
                      <p>{activity.description}</p>
                      {activity.waste && (
                        <span className="activity-meta">
                          {activity.waste} kg • {activity.points} points
                        </span>
                      )}
                    </div>
                    <span className="activity-time">{activity.timestamp}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Users */}
            <div className="section">
              <div className="section-header">
                <h3>Top Contributors 🏆</h3>
              </div>
              <div className="top-users">
                {displayData.topUsers.map((user, index) => (
                  <div key={user.id} className="user-row">
                    <div className="user-rank">#{index + 1}</div>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="user-stats">
                        {user.pickups} pickups • {user.waste} kg • {user.points}{" "}
                        pts
                      </div>
                    </div>
                    <div className="user-points">{user.points}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}