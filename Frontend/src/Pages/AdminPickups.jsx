import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card, AnalyticsCard } from "../components/Card";
import { Button } from "../components/Button";
import { Input, Select } from "../components/Form";
import { LoadingPage } from "../components/Loader";
import "../style/AdminPickups.css";

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

  // Ensure pickups is always an array
  const pickupsArray = Array.isArray(pickups) ? pickups : [];

  // Filter pickups
  const filteredPickups = pickupsArray.filter((p) => {
    const matchSearch =
      p.wasteType.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.user?.username?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.pickupId?.toLowerCase().includes(searchTerm.toLowerCase());

    const matchStatus = filterStatus === "all" || p.status === filterStatus;
    const matchWaste = filterWasteType === "all" || p.wasteType === filterWasteType;

    return matchSearch && matchStatus && matchWaste;
  });

  // Get waste type breakdown
  const wasteTypeStats = pickupsArray.reduce((acc, p) => {
    const type = p.wasteType;
    if (!acc[type]) {
      acc[type] = { count: 0, weight: 0 };
    }
    acc[type].count += 1;
    acc[type].weight += (p.estimatedWeight || 0);
    return acc;
  }, {});

  // Get status breakdown
  const statusStats = pickupsArray.reduce((acc, p) => {
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
              value={pickupsArray.length}
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
              value={(Math.max(0, pickupsArray.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0)) || 0).toFixed(1)}
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
              value={(Math.max(0, pickupsArray.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0)) * 0.21).toFixed(1)}
              unit="kg"
              color="#059669"
              icon="🌍"
            />
          </div>

          {/* Waste Type Breakdown */}
          <div className="waste-type-section">
            <h2 className="section-title">📊 Waste Type Distribution</h2>
            <div className="waste-type-grid">
              {Object.entries(wasteTypeStats).map(([type, data]) => (
                <Card key={type}>
                  <div className="waste-card">
                    <p className="waste-card-label">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </p>
                    <h3 className="waste-card-count">
                      {data.count}
                    </h3>
                    <p className="waste-card-weight">
                      {(data.weight || 0).toFixed(1)} kg
                    </p>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Status Overview */}
          <div className="status-overview-section">
            <h2 className="section-title">Pickup Status Overview</h2>
            <div className="status-grid">
              {["Pending", "Assigned", "In Progress", "Completed", "Cancelled"].map((status) => (
                <div
                  key={status}
                  className="status-card"
                  style={{ borderLeft: `4px solid ${statusColor(status)}` }}
                >
                  <p className="status-card-label">
                    {status}
                  </p>
                  <h3 className="status-card-number" style={{ color: statusColor(status) }}>
                    {statusStats[status] || 0}
                  </h3>
                </div>
              ))}
            </div>
          </div>

          {/* Filters */}
          <div className="filters-section section">
            <Input
              label="Search"
              placeholder="Search by user, waste type..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="filter-input"
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
          <div className="pickups-table-section section">
            <h2 className="section-title">📋 Pickup Requests ({filteredPickups.length})</h2>
            {filteredPickups.length === 0 ? (
              <p className="no-pickups-message">
                No pickups found
              </p>
            ) : (
              <table className="pickups-table">
                <thead className="pickups-table-header">
                  <tr>
                    <th>ID</th>
                    <th>User</th>
                    <th>Type</th>
                    <th>Weight</th>
                    <th>Address</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPickups.map((pickup, idx) => (
                    <tr key={idx}>
                      <td className="pickup-id">
                        {pickup.pickupId?.substring(0, 8)}...
                      </td>
                      <td className="pickup-user">
                        <div>
                          <p className="pickup-user-name">{pickup.user?.username || "N/A"}</p>
                          <p className="pickup-user-email">
                            {pickup.user?.email}
                          </p>
                        </div>
                      </td>
                      <td className="pickup-type">
                        {pickup.wasteType.charAt(0).toUpperCase() + pickup.wasteType.slice(1)}
                      </td>
                      <td className="pickup-weight">
                        {pickup.estimatedWeight} kg
                      </td>
                      <td className="pickup-address">
                        {pickup.pickupAddress?.substring(0, 30)}...
                      </td>
                      <td>
                        <span className="status-badge-inline" style={{
                          background: statusColor(pickup.status) + "20",
                          color: statusColor(pickup.status),
                          borderColor: statusColor(pickup.status)
                        }}>
                          {pickup.status}
                        </span>
                      </td>
                      <td>
                        <select
                          onChange={(e) => {
                            if (e.target.value) updatePickupStatus(pickup.pickupId, e.target.value);
                            e.target.value = "";
                          }}
                          className="status-selector"
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