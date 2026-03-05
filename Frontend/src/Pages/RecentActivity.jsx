// Recent Activity - shows recent pickups from dashboard
import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { LoadingPage } from "../components/Loader";

export default function RecentActivity() {
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState([]);
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
    fetchActivity();
    const refreshInterval = setInterval(fetchActivity, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchActivity = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/");
      
      if (response.data.success) {
        const data = response.data.data;
        setUser(data.user);
        setPickups(data.recentPickups || []);
      }
    } catch (error) {
      console.error("Error fetching activity:", error);
      toast.error("Failed to load activity");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const statusBadge = (status) => (
    <span style={{
      display: "inline-block",
      padding: "4px 12px",
      borderRadius: "20px",
      fontSize: "12px",
      fontWeight: "600",
      backgroundColor: status === "Completed" ? "#d1fae5" : 
                       status === "Pending" ? "#fef3c7" : "#bfdbfe",
      color: status === "Completed" ? "#065f46" : 
             status === "Pending" ? "#92400e" : "#1e40af"
    }}>
      {status}
    </span>
  );

  if (loading) return <LoadingPage message="Loading activity..." />;

  return (
    <div className="dashboard-layout">
      <Sidebar items={menuItems} userInfo={user} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Recent Activity 📝"
          subtitle="Your pickup history and actions"
        />

        <PageContainer>
          <div style={{
            background: "white",
            borderRadius: "12px",
            padding: "24px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.08)",
            border: "1px solid #e5e7eb"
          }}>
            {pickups.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280" }}>
                No recent activity
              </p>
            ) : (
              <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
                {pickups.map((pickup, idx) => (
                  <div key={idx} style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    padding: "12px",
                    background: "#f9fafb",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb"
                  }}>
                    <div>
                      <p style={{ margin: "0 0 4px 0", fontWeight: "600" }}>
                        {pickup.wasteType.charAt(0).toUpperCase() + pickup.wasteType.slice(1)}
                      </p>
                      <p style={{ margin: 0, fontSize: "12px", color: "#6b7280" }}>
                        {pickup.estimatedWeight} kg • {new Date(pickup.requestedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {statusBadge(pickup.status)}
                  </div>
                ))}
              </div>
            )}
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
