// Waste Chart - displays waste type breakdown
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card } from "../components/Card";
import { LoadingPage } from "../components/Loader";

export default function WasteChart() {
  const [loading, setLoading] = useState(true);
  const [wasteBreakdown, setWasteBreakdown] = useState([]);
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
    fetchWasteData();
    const refreshInterval = setInterval(fetchWasteData, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchWasteData = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/");
      
      if (response.data.success) {
        const data = response.data.data;
        setUser(data.user);
        setWasteBreakdown(data.wasteTypeBreakdown || []);
      }
    } catch (error) {
      console.error("Error fetching waste data:", error);
      toast.error("Failed to load waste data");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage message="Loading waste breakdown..." />;

  const totalWaste = wasteBreakdown.reduce((sum, item) => sum + item.totalWeight, 0);

  return (
    <div className="dashboard-layout">
      <Sidebar items={menuItems} userInfo={user} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Waste Breakdown 📊"
          subtitle="Distribution of waste by type"
        />

        <PageContainer>
          <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
            gap: "20px",
            marginBottom: "32px"
          }}>
            {wasteBreakdown.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", gridColumn: "1 / -1" }}>
                No waste data recorded yet
              </p>
            ) : (
              wasteBreakdown.map((item, idx) => {
                const percentage = totalWaste > 0 ? ((item.totalWeight / totalWaste) * 100).toFixed(1) : 0;
                return (
                  <Card key={idx}>
                    <div style={{ padding: "20px", textAlign: "center" }}>
                      <p style={{ color: "#666", fontSize: "14px", marginBottom: "8px" }}>
                        {item.wasteType.charAt(0).toUpperCase() + item.wasteType.slice(1)}
                      </p>
                      <h3 style={{ margin: "8px 0" }}>
                        {item.totalWeight.toFixed(1)} kg
                      </h3>
                      <p style={{ color: "#999", fontSize: "12px" }}>
                        {percentage}% of total
                      </p>
                      <p style={{ color: "#4ade80", fontSize: "12px", fontWeight: "600" }}>
                        {item.count} pickups
                      </p>
                    </div>
                  </Card>
                );
              })
            )}
          </div>

          {totalWaste > 0 && (
            <div style={{
              background: "white",
              borderRadius: "12px",
              padding: "24px",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
              border: "1px solid #e5e7eb",
              textAlign: "center"
            }}>
              <h3>Total Waste Tracked</h3>
              <p style={{ fontSize: "32px", fontWeight: "700", color: "#4ade80", margin: "16px 0" }}>
                {totalWaste.toFixed(1)} kg
              </p>
              <p style={{ color: "#6b7280" }}>
                Keep up the great work! 🌱
              </p>
            </div>
          )}
        </PageContainer>
      </main>
    </div>
  );
}
