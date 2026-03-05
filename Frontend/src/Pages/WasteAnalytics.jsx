import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { LoadingPage } from "../components/Loader";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../style/WasteAnalytics.css";

export default function WasteAnalytics() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [wasteData, setWasteData] = useState([]);
  const [selectedPeriod, setSelectedPeriod] = useState("month");

  const menuItems = [
    { icon: "🏠", label: "Dashboard", href: "/dashboard" },
    { icon: "👤", label: "Profile", href: "/profile" },
    { icon: "♻️", label: "Waste Tracker", href: "/waste-tracker" },
    { icon: "📱", label: "Waste Scanner", href: "/waste-scanner" },
    { icon: "🚚", label: "Schedule Pickup", href: "/schedule-pickup" },
    { icon: "📊", label: "Analytics", href: "/analytics" },
    { icon: "🏆", label: "Leaderboard", href: "/leaderboard" },
    { icon: "🎁", label: "Rewards", href: "/rewards" },
    { icon: "🔔", label: "Notifications", href: "/notifications" },
  ];

  useEffect(() => {
    fetchAnalytics();
    
    // Auto-refresh analytics every 30 seconds
    const refreshInterval = setInterval(fetchAnalytics, 30000);
    
    return () => clearInterval(refreshInterval);
  }, [selectedPeriod]);

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      const response = await api.get("/pickup/my-pickups?limit=100");

      if (response.data.success) {
        // Process data
        const pickups = response.data.data || [];
        
        // Group by waste type
        const wasteByType = {};
        pickups.forEach((pickup) => {
          const type = pickup.wasteType || "Unknown";
          wasteByType[type] = (wasteByType[type] || 0) + pickup.estimatedWeight;
        });

        // Convert to array
        const wasteArray = Object.entries(wasteByType).map(([type, weight]) => ({
          type: type.charAt(0).toUpperCase() + type.slice(1),
          weight: parseFloat(weight).toFixed(1),
          percentage: 0,
        }));

        // Calculate percentages
        const totalWeight = wasteArray.reduce((sum, item) => sum + parseFloat(item.weight), 0);
        wasteArray.forEach((item) => {
          item.percentage = ((parseFloat(item.weight) / totalWeight) * 100).toFixed(1);
        });

        setWasteData(wasteArray);
        setStats({
          totalPickups: pickups.length,
          totalWeight: parseFloat(totalWeight).toFixed(1),
          completedPickups: pickups.filter((p) => p.status === "Completed").length,
          pendingPickups: pickups.filter((p) => p.status === "Pending").length,
          co2Saved: (totalWeight * 0.21).toFixed(1),
          ecoPoints: pickups.length * 100,
        });
        
        toast.success("Analytics updated");
      }
    } catch (error) {
      console.error("Analytics error:", error);
      toast.error(error.response?.data?.message || "Failed to load analytics");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage message="Loading analytics..." />;

  return (
    <div className="dashboard-layout">
      <Sidebar items={menuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Waste Analytics 📊"
          subtitle="Track your environmental impact and waste patterns"
        />

        <PageContainer>
          {/* Key Metrics */}
          <div className="analytics-metrics">
            <Card
              title="Total Pickups"
              value={stats?.totalPickups || 0}
              bgColor="#4ade80"
            />
            <Card
              title="Total Weight"
              value={`${stats?.totalWeight || 0}`}
              subtitle="kg"
              bgColor="#22c55e"
            />
            <Card
              title="CO₂ Prevented"
              value={`${stats?.co2Saved || 0}`}
              subtitle="kg"
              bgColor="#10b981"
            />
            <Card
              title="Eco Points"
              value={stats?.ecoPoints || 0}
              bgColor="#059669"
            />
          </div>

          {/* Period Selector */}
          <div className="period-selector">
            <Button
              variant={selectedPeriod === "week" ? "primary" : "secondary"}
              onClick={() => setSelectedPeriod("week")}
            >
              This Week
            </Button>
            <Button
              variant={selectedPeriod === "month" ? "primary" : "secondary"}
              onClick={() => setSelectedPeriod("month")}
            >
              This Month
            </Button>
            <Button
              variant={selectedPeriod === "year" ? "primary" : "secondary"}
              onClick={() => setSelectedPeriod("year")}
            >
              This Year
            </Button>
            <Button
              variant={selectedPeriod === "all" ? "primary" : "secondary"}
              onClick={() => setSelectedPeriod("all")}
            >
              All Time
            </Button>
          </div>

          <div className="analytics-grid">
            {/* Waste Type Chart */}
            <div className="chart-card">
              <h3>📊 Waste by Type</h3>
              <div className="waste-chart">
                {wasteData.length === 0 ? (
                  <p className="empty-chart">No data available</p>
                ) : (
                  <div className="chart-bars">
                    {wasteData.map((item, idx) => (
                      <div key={idx} className="bar-container">
                        <div className="bar-name">{item.type}</div>
                        <div className="bar-wrapper">
                          <div
                            className="bar"
                            style={{
                              width: `${item.percentage}%`,
                              backgroundColor: [
                                "#4ade80",
                                "#22c55e",
                                "#10b981",
                                "#059669",
                                "#047857",
                                "#065f46",
                                "#064e3b",
                              ][idx % 7],
                            }}
                          >
                            <span className="bar-label">
                              {item.percentage}%
                            </span>
                          </div>
                        </div>
                        <div className="bar-weight">{item.weight} kg</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Status Distribution */}
            <div className="chart-card">
              <h3>✓ Pickup Status</h3>
              <div className="status-chart">
                <div className="status-item completed">
                  <div className="status-dot"></div>
                  <div className="status-info">
                    <span className="status-label">Completed</span>
                    <span className="status-value">{stats?.completedPickups || 0}</span>
                  </div>
                  <div className="status-percentage">
                    {stats?.totalPickups > 0
                      ? Math.round((stats?.completedPickups / stats?.totalPickups) * 100)
                      : 0}
                    %
                  </div>
                </div>
                <div className="status-item pending">
                  <div className="status-dot"></div>
                  <div className="status-info">
                    <span className="status-label">Pending</span>
                    <span className="status-value">{stats?.pendingPickups || 0}</span>
                  </div>
                  <div className="status-percentage">
                    {stats?.totalPickups > 0
                      ? Math.round((stats?.pendingPickups / stats?.totalPickups) * 100)
                      : 0}
                    %
                  </div>
                </div>
              </div>
            </div>

            {/* Impact Summary */}
            <div className="chart-card impact-card">
              <h3>🌍 Environmental Impact</h3>
              <div className="impact-stats">
                <div className="impact-item">
                  <span className="impact-icon">🌳</span>
                  <div>
                    <p>Trees Protected</p>
                    <strong>{Math.round(stats?.totalWeight * 0.008)}</strong>
                  </div>
                </div>
                <div className="impact-item">
                  <span className="impact-icon">💨</span>
                  <div>
                    <p>CO₂ Reduction</p>
                    <strong>{stats?.co2Saved} kg</strong>
                  </div>
                </div>
                <div className="impact-item">
                  <span className="impact-icon">💧</span>
                  <div>
                    <p>Water Saved</p>
                    <strong>{Math.round(stats?.totalWeight * 11)} L</strong>
                  </div>
                </div>
                <div className="impact-item">
                  <span className="impact-icon">⚡</span>
                  <div>
                    <p>Energy Saved</p>
                    <strong>{Math.round(stats?.totalWeight * 2)} kWh</strong>
                  </div>
                </div>
              </div>
            </div>

            {/* Waste Distribution Pie */}
            <div className="chart-card">
              <h3>📈 Weight Distribution</h3>
              <div className="pie-chart">
                {wasteData.length === 0 ? (
                  <p className="empty-chart">No data available</p>
                ) : (
                  <div className="pie-legend">
                    {wasteData.map((item, idx) => (
                      <div key={idx} className="legend-item">
                        <span
                          className="legend-color"
                          style={{
                            backgroundColor: [
                              "#4ade80",
                              "#22c55e",
                              "#10b981",
                              "#059669",
                              "#047857",
                              "#065f46",
                              "#064e3b",
                            ][idx % 7],
                          }}
                        ></span>
                        <span className="legend-label">{item.type}</span>
                        <span className="legend-value">{item.weight} kg</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Insights */}
          <div className="insights-section">
            <h3>💡 Insights</h3>
            <div className="insights-grid">
              <div className="insight-card">
                <p>By recycling <strong>{stats?.totalWeight} kg</strong> of waste, you've helped prevent the release of <strong>{stats?.co2Saved} kg</strong> of CO₂ into the atmosphere.</p>
              </div>
              <div className="insight-card">
                <p>You've earned <strong>{stats?.ecoPoints}</strong> eco points! Keep up the good work contributing to a sustainable future.</p>
              </div>
              <div className="insight-card">
                <p>Continue scheduling pickups to increase your impact. The more you recycle, the more rewards you unlock!</p>
              </div>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
