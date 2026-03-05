import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card, AnalyticsCard } from "../components/Card";
import { Input, Select } from "../components/Form";
import { LoadingPage } from "../components/Loader";
import "../style/Admin.css";

export default function AdminAnalytics() {
  const [pickups, setPickups] = useState([]);
  const [users, setUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("7");

  const adminMenuItems = [
    { icon: "📊", label: "Dashboard", href: "/admin-dashboard" },
    { icon: "🚚", label: "Pickups", href: "/admin-pickups" },
    { icon: "👥", label: "Users", href: "/admin-users" },
    { icon: "📈", label: "Analytics", href: "/admin-analytics" },
    { icon: "🌍", label: "Impact", href: "/admin-impact" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pickupsRes, usersRes, statsRes] = await Promise.all([
        api.get("/pickup/admin/all?limit=1000"),
        api.get("/auth/all"),
        api.get("/pickup/admin/stats"),
      ]);

      if (pickupsRes.data.success) {
        setPickups(pickupsRes.data.data || []);
      }
      if (usersRes.data.success) {
        setUsers(usersRes.data.data || []);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data || {});
      }

      toast.success("✅ Analytics data loaded");
    } catch (error) {
      console.error("❌ Analytics fetch error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      toast.error(`Failed to load analytics: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const refreshInterval = setInterval(fetchData, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Calculate analytics
  const totalPickups = pickups.length;
  const completedPickups = pickups.filter((p) => p.status === "Completed").length;
  const completionRate = ((completedPickups / totalPickups) * 100 || 0).toFixed(1);
  
  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.status === "active").length;
  const totalWaste = pickups.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0);
  
  // Pickup status breakdown
  const statusCounts = pickups.reduce((acc, p) => {
    acc[p.status] = (acc[p.status] || 0) + 1;
    return acc;
  }, {});

  // Waste type distribution
  const wasteTypeStats = pickups.reduce((acc, p) => {
    const type = p.wasteType;
    if (!acc[type]) {
      acc[type] = { count: 0, weight: 0, percentage: 0 };
    }
    acc[type].count += 1;
    acc[type].weight += p.estimatedWeight || 0;
    return acc;
  }, {});

  // Calculate percentages
  Object.keys(wasteTypeStats).forEach((type) => {
    wasteTypeStats[type].percentage =
      ((wasteTypeStats[type].weight / totalWaste) * 100 || 0).toFixed(1);
  });

  // Top users by pickups
  const topUsers = users
    .map((u) => ({
      ...u,
      pickupsCount: pickups.filter((p) => p.userId === u.userId).length,
    }))
    .sort((a, b) => b.pickupsCount - a.pickupsCount)
    .slice(0, 5);

  // Daily pickup trend (simplified)
  const dailyTrend = pickups.reduce((acc, p) => {
    const date = new Date(p.createdAt).toLocaleDateString();
    acc[date] = (acc[date] || 0) + 1;
    return acc;
  }, {});

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage message="Loading analytics..." />;

  return (
    <div className="dashboard-layout">
      <Sidebar items={adminMenuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Analytics Dashboard"
          subtitle="Comprehensive system analytics and performance metrics"
        />

        <PageContainer>
          {/* Time Range Filter */}
          <div
            style={{
              display: "flex",
              gap: "12px",
              marginBottom: "24px",
              alignItems: "flex-end",
              flexWrap: "wrap",
            }}
          >
            <Select
              label="Time Range"
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              options={[
                { label: "Last 7 Days", value: "7" },
                { label: "Last 30 Days", value: "30" },
                { label: "Last 3 Months", value: "90" },
                { label: "All Time", value: "all" },
              ]}
              style={{ minWidth: "200px" }}
            />
          </div>

          {/* Key Metrics */}
          <div className="analytics-grid">
            <AnalyticsCard
              label="Total Pickups"
              value={totalPickups}
              unit="requests"
              color="#4ade80"
              icon="📦"
            />
            <AnalyticsCard
              label="Completion Rate"
              value={completionRate}
              unit="%"
              color="#10b981"
              icon="✅"
            />
            <AnalyticsCard
              label="Active Users"
              value={activeUsers}
              unit={`of ${totalUsers}`}
              color="#06b6d4"
              icon="👥"
            />
            <AnalyticsCard
              label="Total Waste Processed"
              value={totalWaste.toFixed(1)}
              unit="kg"
              color="#8b5cf6"
              icon="♻️"
            />
            <AnalyticsCard
              label="CO₂ Prevented"
              value={(totalWaste * 0.21).toFixed(1)}
              unit="kg"
              color="#f59e0b"
              icon="🌍"
            />
            <AnalyticsCard
              label="Avg Waste per Pickup"
              value={(totalWaste / totalPickups || 0).toFixed(1)}
              unit="kg"
              color="#ec4899"
              icon="📊"
            />
          </div>

          {/* Status Overview */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">📊 Pickup Status Distribution</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
                gap: "12px",
                marginTop: "16px",
              }}
            >
              {["Pending", "Assigned", "In Progress", "Completed", "Cancelled"].map(
                (status) => (
                  <div
                    key={status}
                    style={{
                      padding: "16px",
                      background: "#f9fafb",
                      borderRadius: "8px",
                      textAlign: "center",
                      border: "1px solid #e5e7eb",
                    }}
                  >
                    <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280" }}>
                      {status}
                    </p>
                    <h3
                      style={{
                        margin: "0",
                        fontSize: "24px",
                        fontWeight: "700",
                        color: "#4ade80",
                      }}
                    >
                      {statusCounts[status] || 0}
                    </h3>
                    <p
                      style={{
                        margin: "8px 0 0 0",
                        fontSize: "11px",
                        color: "#9ca3af",
                      }}
                    >
                      {(((statusCounts[status] || 0) / totalPickups) * 100).toFixed(0)}%
                    </p>
                  </div>
                )
              )}
            </div>
          </div>

          {/* Waste Type Analysis */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">♻️ Waste Type Analysis</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              {Object.entries(wasteTypeStats).map(([type, data]) => (
                <Card key={type}>
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700" }}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </h3>
                    <div
                      style={{
                        height: "6px",
                        background: "#e5e7eb",
                        borderRadius: "3px",
                        marginBottom: "12px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          height: "100%",
                          background: "#4ade80",
                          width: `${data.percentage}%`,
                        }}
                      />
                    </div>
                    <div style={{ fontSize: "12px", color: "#6b7280" }}>
                      <p style={{ margin: "4px 0" }}>Count: {data.count}</p>
                      <p style={{ margin: "4px 0" }}>⚖️ Weight: {data.weight.toFixed(1)} kg</p>
                      <p style={{ margin: "4px 0", fontWeight: "600", color: "#4ade80" }}>
                        💯 Percentage: {data.percentage}%
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Top Contributors */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">🏆 Top Contributors</h2>
            <div
              style={{
                marginTop: "16px",
              }}
            >
              {topUsers.length === 0 ? (
                <p style={{ textAlign: "center", color: "#6b7280" }}>No user data yet</p>
              ) : (
                <div
                  style={{
                    display: "grid",
                    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                    gap: "16px",
                  }}
                >
                  {topUsers.map((user, idx) => (
                    <Card key={user.userId}>
                      <div style={{ padding: "16px" }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "12px" }}>
                          <div
                            style={{
                              width: "40px",
                              height: "40px",
                              borderRadius: "50%",
                              background: "#4ade80",
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              color: "white",
                              fontWeight: "700",
                              fontSize: "18px",
                            }}
                          >
                            {idx + 1}
                          </div>
                          <div>
                            <h4 style={{ margin: "0", fontSize: "14px", fontWeight: "700" }}>
                              {user.username}
                            </h4>
                            <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#6b7280" }}>
                              {user.email}
                            </p>
                          </div>
                        </div>
                        <div style={{ padding: "12px", background: "#f9fafb", borderRadius: "6px" }}>
                          <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280" }}>
                            Pickups Submitted
                          </p>
                          <p style={{ margin: "0", fontSize: "20px", fontWeight: "700", color: "#4ade80" }}>
                            {user.pickupsCount}
                          </p>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* System Insights */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">System Insights</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <Card>
                <div style={{ padding: "16px", borderLeft: "4px solid #4ade80" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "700", color: "#4ade80" }}>
                    Performance
                  </h3>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280" }}>
                    System completion rate of {completionRate}% shows{" "}
                    {completionRate > 80 ? "excellent" : completionRate > 60 ? "good" : "fair"}{" "}
                    performance in waste collection.
                  </p>
                </div>
              </Card>
              <Card>
                <div style={{ padding: "16px", borderLeft: "4px solid #8b5cf6" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "700", color: "#8b5cf6" }}>
                    Growth
                  </h3>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280" }}>
                    {activeUsers} active users out of {totalUsers} total{" "}
                    {(((activeUsers / totalUsers) * 100).toFixed(0))}%{" "}
                    participation rate in the recycling program.
                  </p>
                </div>
              </Card>
              <Card>
                <div style={{ padding: "16px", borderLeft: "4px solid #f59e0b" }}>
                  <h3 style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "700", color: "#f59e0b" }}>
                    ♻️ Impact
                  </h3>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280" }}>
                    {totalWaste.toFixed(0)} kg of waste successfully diverted from landfills,
                    preventing {(totalWaste * 0.21).toFixed(0)} kg of CO₂ emissions.
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Recent Trends */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">📅 Recent Activity Trend</h2>
            <div
              style={{
                marginTop: "16px",
                overflowX: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  gap: "8px",
                  minWidth: "fit-content",
                }}
              >
                {Object.entries(dailyTrend)
                  .slice(-7)
                  .map(([date, count]) => (
                    <div
                      key={date}
                      style={{
                        minWidth: "80px",
                        textAlign: "center",
                        padding: "12px",
                        background: "#f9fafb",
                        borderRadius: "8px",
                        border: "1px solid #e5e7eb",
                      }}
                    >
                      <p style={{ margin: "0 0 8px 0", fontSize: "11px", color: "#6b7280" }}>
                        {date}
                      </p>
                      <p
                        style={{
                          margin: "0",
                          fontSize: "18px",
                          fontWeight: "700",
                          color: "#4ade80",
                        }}
                      >
                        {count}
                      </p>
                      <p style={{ margin: "4px 0 0 0", fontSize: "10px", color: "#9ca3af" }}>
                        pickups
                      </p>
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
