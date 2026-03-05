import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card, AnalyticsCard } from "../components/Card";
import { Button } from "../components/Button";
import { Input, Select } from "../components/Form";
import { LoadingPage } from "../components/Loader";
import "../style/Admin.css";

export default function AdminPickups() {
  const [pickups, setPickups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterWasteType, setFilterWasteType] = useState("all");

  const adminMenuItems = [
    { icon: "📊", label: "Dashboard", href: "/admin-dashboard" },
    { icon: "🚚", label: "Pickups", href: "/admin-pickups" },
    { icon: "👥", label: "Users", href: "/admin-users" },
    { icon: "📈", label: "Analytics", href: "/admin-analytics" },
    { icon: "🌍", label: "Impact", href: "/admin-impact" },
  ];

  // Fetch pickups and stats
  const fetchData = async () => {
    try {
      setLoading(true);
      const [pickupsRes, statsRes] = await Promise.all([
        api.get("/pickup/admin/all?limit=100"),
        api.get("/pickup/admin/stats"),
      ]);

      if (pickupsRes.data.success) {
        setPickups(pickupsRes.data.data || []);
      }
      
      if (statsRes.data.success) {
        setStats(statsRes.data.data || {});
      }

      toast.success("✅ Pickups loaded successfully");
    } catch (error) {
      console.error("❌ Pickups fetch error:", {
        message: error.message,
        status: error.response?.status,
        data: error.response?.data,
        url: error.config?.url,
      });
      toast.error(`Failed to load pickups: ${error.response?.data?.message || error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const refreshInterval = setInterval(fetchData, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Update pickup status
  const updatePickupStatus = async (pickupId, newStatus) => {
    try {
      const response = await api.put(`/pickup/admin/status/${pickupId}`, {
        status: newStatus,
        notes: `Status updated to ${newStatus}`,
      });

      if (response.data.success) {
        toast.success(`✅ Updated to ${newStatus}`);
        fetchData();
      } else {
        toast.error("Failed to update status");
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error updating pickup");
    }
  };

  // Filter pickups
  const filteredPickups = pickups.filter((p) => {
    const matchSearch =
      p.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pickupId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchWaste = filterWasteType === "all" || p.wasteType === filterWasteType;

    return matchSearch && matchStatus && matchWaste;
  });

  // Get waste type breakdown
  const wasteTypeStats = pickups.reduce((acc, p) => {
    const type = p.wasteType;
    if (!acc[type]) {
      acc[type] = { count: 0, weight: 0 };
    }
    acc[type].count += 1;
    acc[type].weight += p.estimatedWeight;
    return acc;
  }, {});

  // Get status breakdown
  const statusStats = pickups.reduce((acc, p) => {
    const status = p.status;
    acc[status] = (acc[status] || 0) + 1;
    return acc;
  }, {});

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const statusColor = (status) => {
    switch (status) {
      case "Pending":
        return "#f59e0b";
      case "Assigned":
        return "#06b6d4";
      case "In Progress":
        return "#8b5cf6";
      case "Completed":
        return "#10b981";
      case "Cancelled":
        return "#ef4444";
      default:
        return "#6b7280";
    }
  };

  if (loading) return <LoadingPage message="Loading pickup management..." />;

  return (
    <div className="dashboard-layout">
      <Sidebar items={adminMenuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Pickup Management 🚚"
          subtitle="Monitor and manage all waste collection requests"
        />

        <PageContainer>
          {/* Top Statistics */}
          <div className="analytics-grid">
            <AnalyticsCard
              label="Total Pickups"
              value={pickups.length}
              unit="requests"
              color="#4ade80"
              icon="📦"
            />
            <AnalyticsCard
              label="Pending Requests"
              value={statusStats["Pending"] || 0}
              unit="waiting"
              color="#f59e0b"
              icon="⏳"
            />
            <AnalyticsCard
              label="In Progress"
              value={(statusStats["In Progress"] || 0) + (statusStats["Assigned"] || 0)}
              unit="active"
              color="#8b5cf6"
              icon="🚚"
            />
            <AnalyticsCard
              label="Total Waste Collected"
              value={pickups.reduce((sum, p) => sum + p.estimatedWeight, 0).toFixed(1)}
              unit="kg"
              color="#06b6d4"
              icon="♻️"
            />
            <AnalyticsCard
              label="Completed Today"
              value={statusStats["Completed"] || 0}
              unit="completed"
              color="#10b981"
              icon="✅"
            />
            <AnalyticsCard
              label="CO₂ Saved"
              value={(pickups.reduce((sum, p) => sum + p.estimatedWeight, 0) * 0.21).toFixed(1)}
              unit="kg"
              color="#059669"
              icon="🌍"
            />
          </div>

          {/* Waste Type Breakdown */}
          <div className="section" style={{ marginTop: "32px" }}>
            <h2 className="section-title">📊 Waste Type Distribution</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
              gap: "16px",
              marginTop: "16px"
            }}>
              {Object.entries(wasteTypeStats).map(([type, data]) => (
                <Card key={type}>
                  <div style={{ padding: "16px", textAlign: "center" }}>
                    <p style={{ margin: "0 0 8px 0", fontSize: "14px", color: "#6b7280" }}>
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </p>
                    <h3 style={{ margin: "8px 0", fontSize: "24px", color: "#4ade80" }}>
                      {data.count}
                    </h3>
                    <p style={{ margin: "0", fontSize: "12px", color: "#9ca3af" }}>
                      {data.weight.toFixed(1)} kg
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Status Overview */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">Pickup Status Overview</h2>
            <div style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))",
              gap: "16px",
              marginTop: "16px"
            }}>
              {["Pending", "Assigned", "In Progress", "Completed", "Cancelled"].map((status) => (
                <div
                  key={status}
                  style={{
                    padding: "16px",
                    background: "#f9fafb",
                    borderRadius: "8px",
                    borderLeft: `4px solid ${statusColor(status)}`,
                    textAlign: "center"
                  }}
                >
                  <p style={{ margin: "0 0 8px 0", fontSize: "12px", color: "#6b7280", fontWeight: "600" }}>
                    {status}
                  </p>
                  <h3 style={{ margin: 0, fontSize: "28px", fontWeight: "700", color: statusColor(status) }}>
                    {statusStats[status] || 0}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="section" style={{ marginTop: "24px", display: "flex", gap: "16px", flexWrap: "wrap", alignItems: "flex-end" }}>
            <Input
              label="Search"
              placeholder="Search by user, waste type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              style={{ flex: 1, minWidth: "200px" }}
            />
            <Select
              label="Status"
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              options={[
                { label: "All Statuses", value: "all" },
                { label: "Pending", value: "Pending" },
                { label: "Assigned", value: "Assigned" },
                { label: "In Progress", value: "In Progress" },
                { label: "Completed", value: "Completed" },
                { label: "Cancelled", value: "Cancelled" },
              ]}
            />
            <Select
              label="Waste Type"
              value={filterWasteType}
              onChange={(e) => setFilterWasteType(e.target.value)}
              options={[
                { label: "All Types", value: "all" },
                ...Object.keys(wasteTypeStats).map((type) => ({
                  label: type.charAt(0).toUpperCase() + type.slice(1),
                  value: type,
                })),
              ]}
            />
          </div>

          {/* Pickups Table */}
          <div className="section" style={{ marginTop: "24px", overflowX: "auto" }}>
            <h2 className="section-title">📋 Pickup Requests ({filteredPickups.length})</h2>
            {filteredPickups.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", padding: "32px" }}>
                No pickups found
              </p>
            ) : (
              <table style={{
                width: "100%",
                borderCollapse: "collapse",
                marginTop: "16px"
              }}>
                <thead>
                  <tr style={{ borderBottom: "2px solid #e5e7eb", background: "#f9fafb" }}>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>ID</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>User</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>Type</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>Weight</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>Address</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>Status</th>
                    <th style={{ padding: "12px", textAlign: "left", fontSize: "12px", fontWeight: "700", color: "#6b7280" }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPickups.map((pickup, idx) => (
                    <tr key={idx} style={{ borderBottom: "1px solid #e5e7eb", hover: { background: "#f9fafb" } }}>
                      <td style={{ padding: "12px", fontSize: "12px", color: "#6b7280" }}>
                        {pickup.pickupId?.substring(0, 8)}...
                      </td>
                      <td style={{ padding: "12px", fontSize: "13px" }}>
                        <div>
                          <p style={{ margin: 0, fontWeight: "600" }}>{pickup.user?.username || "N/A"}</p>
                          <p style={{ margin: "4px 0 0 0", fontSize: "11px", color: "#9ca3af" }}>
                            {pickup.user?.email}
                          </p>
                        </div>
                      </td>
                      <td style={{ padding: "12px", fontSize: "13px", fontWeight: "600" }}>
                        {pickup.wasteType.charAt(0).toUpperCase() + pickup.wasteType.slice(1)}
                      </td>
                      <td style={{ padding: "12px", fontSize: "13px", color: "#4ade80", fontWeight: "600" }}>
                        {pickup.estimatedWeight} kg
                      </td>
                      <td style={{ padding: "12px", fontSize: "12px", color: "#6b7280", maxWidth: "150px" }}>
                        {pickup.pickupAddress?.substring(0, 30)}...
                      </td>
                      <td style={{ padding: "12px" }}>
                        <span style={{
                          display: "inline-block",
                          padding: "6px 12px",
                          background: statusColor(pickup.status) + "20",
                          color: statusColor(pickup.status),
                          borderRadius: "20px",
                          fontSize: "12px",
                          fontWeight: "600",
                          border: `1px solid ${statusColor(pickup.status)}`
                        }}>
                          {pickup.status}
                        </span>
                      </td>
                      <td style={{ padding: "12px" }}>
                        <select
                          onChange={(e) => {
                            if (e.target.value) updatePickupStatus(pickup.pickupId, e.target.value);
                            e.target.value = "";
                          }}
                          style={{
                            padding: "6px 8px",
                            border: "1px solid #d1d5db",
                            borderRadius: "6px",
                            fontSize: "12px",
                            cursor: "pointer",
                          }}
                        >
                          <option value="">Change Status</option>
                          {pickup.status === "Pending" && (
                            <>
                              <option value="Assigned">✅ Accept</option>
                              <option value="Cancelled">❌ Cancel</option>
                            </>
                          )}
                          {pickup.status === "Assigned" && (
                            <>
                              <option value="In Progress">🚚 Start</option>
                              <option value="Cancelled">❌ Cancel</option>
                            </>
                          )}
                          {pickup.status === "In Progress" && (
                            <>
                              <option value="Completed">✅ Complete</option>
                              <option value="Cancelled">❌ Cancel</option>
                            </>
                          )}
                          {(pickup.status === "Completed" || pickup.status === "Cancelled") && (
                            <option value={pickup.status}>{pickup.status}</option>
                          )}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </PageContainer>
      </main>
    </div>
  );
}