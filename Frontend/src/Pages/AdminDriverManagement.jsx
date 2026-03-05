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

export default function DriverManagement() {
  const [drivers, setDrivers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAddDriver, setShowAddDriver] = useState(false);
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    phone: "",
    vehicle: "Truck",
  });

  const adminMenuItems = [
    { icon: "📊", label: "Dashboard", href: "/admin-dashboard" },
    { icon: "🚚", label: "Pickups", href: "/admin-pickups" },
    { icon: "👥", label: "Users", href: "/admin-users" },
    { icon: "�", label: "Analytics", href: "/admin-analytics" },
    { icon: "🌍", label: "Impact", href: "/admin-impact" },
  ];

  // Fetch drivers
  const fetchDrivers = async () => {
    try {
      setLoading(true);
      const response = await api.get("/auth/all");

      if (response.data.success) {
        // Filter only driver-type users
        const driversList = response.data.data.filter(
          (u) => u.role === "driver" || u.role === "admin"
        );
        setDrivers(driversList);

        // Calculate stats
        const pickupsAssigned = driversList.reduce((sum, d) => sum + (d.pickupsAssigned || 0), 0);
        const pickupsCompleted = driversList.reduce((sum, d) => sum + (d.pickupsCompleted || 0), 0);
        const totalWaste = driversList.reduce((sum, d) => sum + (d.totalWasteCollected || 0), 0);

        setStats({
          totalDrivers: driversList.length,
          activeDrivers: driversList.filter((d) => d.status === "active").length,
          pickupsAssigned,
          pickupsCompleted,
          totalWaste,
          averagePickupsPerDriver: (pickupsCompleted / driversList.length || 0).toFixed(1),
        });
      }

      toast.success("Drivers loaded");
    } catch (error) {
      console.error("Error fetching drivers:", error);
      toast.error("Failed to load drivers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDrivers();
    const refreshInterval = setInterval(fetchDrivers, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  const handleAddDriver = async (e) => {
    e.preventDefault();

    if (!formData.username || !formData.email) {
      toast.error("Please fill all required fields");
      return;
    }

    try {
      const response = await api.post("/auth/create", {
        ...formData,
        userType: "User",
        name: formData.username,
        phone: formData.phone,
        city: "Admin Created",
        password: "Driver@123",
      });

      if (response.data.success) {
        toast.success("Driver added successfully");
        setShowAddDriver(false);
        setFormData({ username: "", email: "", phone: "", vehicle: "Truck" });
        fetchDrivers();
      }
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to add driver");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage message="Loading driver management..." />;

  return (
    <div className="dashboard-layout">
      <Sidebar items={adminMenuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Driver Management 🚗"
          subtitle="Manage waste collection drivers and their performance"
        />

        <PageContainer>
          {/* Top Statistics */}
          <div className="analytics-grid">
            <AnalyticsCard
              label="Total Drivers"
              value={stats?.totalDrivers || 0}
              unit="active"
              color="#4ade80"
              icon="👤"
            />
            <AnalyticsCard
              label="Active Now"
              value={stats?.activeDrivers || 0}
              unit="on duty"
              color="#06b6d4"
              icon="🟢"
            />
            <AnalyticsCard
              label="Total Pickups Done"
              value={stats?.pickupsCompleted || 0}
              unit="completed"
              color="#10b981"
              icon="✅"
            />
            <AnalyticsCard
              label="Total Waste Collected"
              value={(stats?.totalWaste || 0).toFixed(1)}
              unit="kg"
              color="#8b5cf6"
              icon="♻️"
            />
            <AnalyticsCard
              label="Avg Pickups/Driver"
              value={stats?.averagePickupsPerDriver || 0}
              unit="per driver"
              color="#f59e0b"
              icon="📊"
            />
            <AnalyticsCard
              label="CO₂ Offset"
              value={((stats?.totalWaste || 0) * 0.21).toFixed(1)}
              unit="kg"
              color="#059669"
              icon="🌍"
            />
          </div>

          {/* Add Driver Section */}
          <div className="section" style={{ marginTop: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <h2 className="section-title">🚗 Manage Drivers</h2>
              <Button
                onClick={() => setShowAddDriver(!showAddDriver)}
                style={{
                  background: "#4ade80",
                  color: "white",
                  padding: "8px 16px",
                  border: "none",
                  borderRadius: "6px",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {showAddDriver ? "Cancel" : "+ Add Driver"}
              </Button>
            </div>

            {showAddDriver && (
              <form onSubmit={handleAddDriver} style={{ background: "#f9fafb", padding: "16px", borderRadius: "8px", marginBottom: "24px" }}>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px", marginBottom: "16px" }}>
                  <Input
                    label="Name"
                    placeholder="Driver name"
                    value={formData.username}
                    onChange={(e) =>
                      setFormData({ ...formData, username: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Email"
                    type="email"
                    placeholder="driver@email.com"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                    required
                  />
                  <Input
                    label="Phone"
                    placeholder="+1234567890"
                    value={formData.phone}
                    onChange={(e) =>
                      setFormData({ ...formData, phone: e.target.value })
                    }
                  />
                  <Select
                    label="Vehicle Type"
                    value={formData.vehicle}
                    onChange={(e) =>
                      setFormData({ ...formData, vehicle: e.target.value })
                    }
                    options={[
                      { label: "Truck", value: "Truck" },
                      { label: "Van", value: "Van" },
                      { label: "Bike", value: "Bike" },
                      { label: "Cart", value: "Cart" },
                    ]}
                  />
                </div>
                <Button type="submit" style={{ background: "#4ade80", color: "white", padding: "10px 20px", border: "none", borderRadius: "6px", cursor: "pointer" }}>
                  ➕ Add Driver
                </Button>
              </form>
            )}
          </div>

          {/* Drivers Table */}
          <div className="section" style={{ marginTop: "24px", overflowX: "auto" }}>
            <h2 className="section-title">👥 Drivers List</h2>
            {drivers.length === 0 ? (
              <p style={{ textAlign: "center", color: "#6b7280", padding: "32px" }}>
                No drivers found
              </p>
            ) : (
              <table>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Pickups Completed</th>
                    <th>Waste Collected</th>
                    <th>Status</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {drivers.map((driver) => (
                    <tr key={driver.userId}>
                      <td>{driver.username}</td>
                      <td>{driver.email}</td>
                      <td>{driver.phone || "N/A"}</td>
                      <td style={{ fontWeight: "600", color: "#4ade80" }}>
                        {driver.pickupsCompleted || 0}
                      </td>
                      <td style={{ fontWeight: "600", color: "#8b5cf6" }}>
                        {(driver.totalWasteCollected || 0).toFixed(1)} kg
                      </td>
                      <td>
                        <span
                          style={{
                            display: "inline-block",
                            padding: "6px 12px",
                            background: driver.status === "active" ? "#d1fae5" : "#fee2e2",
                            color: driver.status === "active" ? "#065f46" : "#7f1d1d",
                            borderRadius: "20px",
                            fontSize: "12px",
                            fontWeight: "600",
                            border: `1px solid ${driver.status === "active" ? "#6ee7b7" : "#fecaca"}`,
                          }}
                        >
                          {driver.status || "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          onClick={() => {
                            navigator.clipboard.writeText(driver.email);
                            toast.success("Email copied!");
                          }}
                          style={{
                            padding: "6px 12px",
                            background: "#dbeafe",
                            color: "#0c2d6b",
                            border: "none",
                            borderRadius: "6px",
                            cursor: "pointer",
                            fontWeight: "600",
                            fontSize: "12px",
                          }}
                        >
                          📧 Email
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Performance Tips */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">Performance Tips</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <Card>
                <div style={{ padding: "16px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "#4ade80" }}>
                    Assignment Strategy
                  </p>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280" }}>
                    Assign pickups based on driver location and capacity for efficient routing.
                  </p>
                </div>
              </Card>
              <Card>
                <div style={{ padding: "16px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "#8b5cf6" }}>
                    📊 Track Analytics
                  </p>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280" }}>
                    Monitor driver performance and waste collection metrics for optimization.
                  </p>
                </div>
              </Card>
              <Card>
                <div style={{ padding: "16px" }}>
                  <p style={{ margin: "0 0 8px 0", fontSize: "14px", fontWeight: "600", color: "#f59e0b" }}>
                    🏆 Incentivize Performance
                  </p>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280" }}>
                    Reward top performers to maintain high quality and efficiency standards.
                  </p>
                </div>
              </Card>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
