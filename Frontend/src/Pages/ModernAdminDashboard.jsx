import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card, AnalyticsCard } from "../components/Card";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { Select, Input } from "../components/Form";
import { LoadingPage } from "../components/Loader";
import { toast } from "react-toastify";
import "../style/AdminDashboard.css";

export default function AdminDashboard() {
  const [pickups, setPickups] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showStatusModal, setShowStatusModal] = useState(false);
  const [driverId, setDriverId] = useState("");
  const [newStatus, setNewStatus] = useState("");
  const [assignLoading, setAssignLoading] = useState(false);

  const token = localStorage.getItem("token");

  const adminMenuItems = [
    { icon: "📊", label: "Dashboard", href: "/admin-dashboard" },
    { icon: "🚚", label: "Pickups", href: "/admin-pickups" },
    { icon: "👥", label: "Users", href: "/admin-users" },
    { icon: "📈", label: "Analytics", href: "/admin-analytics" },
    { icon: "⚙️", label: "Settings", href: "/admin-settings" },
  ];

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [pickupsRes, statsRes] = await Promise.all([
        fetch("http://localhost:5000/api/pickup/admin/all?limit=50", {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch("http://localhost:5000/api/pickup/admin/stats", {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ]);

      const pickupsData = await pickupsRes.json();
      const statsData = await statsRes.json();

      if (pickupsData.success) setPickups(pickupsData.data);
      if (statsData.success) setStats(statsData.data);
    } catch (error) {
      console.error(error);
      toast.error("Failed to load data");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignDriver = async () => {
    if (!driverId || !selectedPickup) {
      toast.error("Please select a driver");
      return;
    }

    setAssignLoading(true);

    try {
      const response = await fetch(
        `http://localhost:5000/api/pickup/admin/assign/${selectedPickup.pickupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ driverId: parseInt(driverId) }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Driver assigned successfully!");
        setShowAssignModal(false);
        fetchData();
      } else {
        toast.error(data.message || "Failed to assign driver");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error assigning driver");
    } finally {
      setAssignLoading(false);
    }
  };

  const handleStatusUpdate = async () => {
    if (!newStatus || !selectedPickup) {
      toast.error("Please select a status");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/pickup/admin/status/${selectedPickup.pickupId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            status: newStatus,
            notes: `Status updated to ${newStatus}`,
          }),
        }
      );

      const data = await response.json();
      if (data.success) {
        toast.success("Status updated successfully!");
        setShowStatusModal(false);
        fetchData();
      } else {
        toast.error(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error updating status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage message="Loading admin dashboard..." />;

  const statusBadge = (status) => (
    <div className={`badge badge-${status.toLowerCase().replace(" ", "-")}`}>
      {status}
    </div>
  );

  const columns = [
    {
      key: "wasteType",
      label: "Waste Type",
      render: (type) => <strong>{type}</strong>,
      width: "120px",
    },
    {
      key: "estimatedWeight",
      label: "Weight",
      render: (weight) => `${weight} kg`,
      width: "80px",
    },
    { key: "pickupAddress", label: "Address", width: "250px" },
    {
      key: "status",
      label: "Status",
      render: statusBadge,
      width: "120px",
    },
    {
      key: "driverId",
      label: "Driver",
      render: (driverId) => driverId ? `#${driverId}` : "—",
      width: "80px",
    },
    {
      key: "requestedAt",
      label: "Requested",
      render: (date) => new Date(date).toLocaleDateString(),
      width: "120px",
    },
  ];

  return (
    <div className="dashboard-layout">
      <Sidebar items={adminMenuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Admin Dashboard 📊"
          subtitle="Manage waste pickup requests and track system performance"
        />

        <PageContainer>
          {/* Stats */}
          {stats && (
            <div className="admin-stats">
              <AnalyticsCard
                label="Total Pickups"
                value={stats.totalPickups}
                unit="requests"
                color="#4ade80"
                icon="📦"
              />
              <AnalyticsCard
                label="Pending"
                value={stats.statusBreakdown.pending}
                unit="requests"
                color="#f59e0b"
                icon="⏳"
              />
              <AnalyticsCard
                label="Assigned"
                value={stats.statusBreakdown.assigned}
                unit="drivers"
                color="#06b6d4"
                icon="🚚"
              />
              <AnalyticsCard
                label="Completed"
                value={stats.statusBreakdown.completed}
                unit="requests"
                color="#4ade80"
                icon="✅"
              />
              <AnalyticsCard
                label="Total Recycled"
                value={stats.totalRecycledWeight.toFixed(1)}
                unit="kg"
                color="#8b5cf6"
                icon="♻️"
              />
            </div>
          )}

          {/* Pickups Table */}
          <div className="admin-section">
            <div className="section-header">
              <h2 className="section-title">All Pickup Requests</h2>
              <Button variant="secondary" size="sm" onClick={fetchData}>
                🔄 Refresh
              </Button>
            </div>

            <Table
              columns={columns}
              data={pickups}
              loading={loading}
              actions={(row) => (
                <div className="action-buttons-small">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPickup(row);
                      setShowAssignModal(true);
                    }}
                    disabled={row.status === "Completed"}
                  >
                    👤
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPickup(row);
                      setShowStatusModal(true);
                    }}
                  >
                    ✏️
                  </Button>
                </div>
              )}
            />
          </div>

          {/* Waste Breakdown */}
          {stats && stats.wasteTypeBreakdown && (
            <div className="admin-section">
              <h2 className="section-title">Waste Type Breakdown</h2>
              <div className="waste-breakdown">
                {stats.wasteTypeBreakdown.map((waste, idx) => (
                  <Card key={idx} title={waste.wasteType} value={waste.count}>
                    <p className="waste-weight">{waste.totalWeight} kg</p>
                  </Card>
                ))}
              </div>
            </div>
          )}
        </PageContainer>

        {/* Assign Driver Modal */}
        <Modal
          isOpen={showAssignModal}
          onClose={() => setShowAssignModal(false)}
          title="Assign Driver"
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                variant="secondary"
                onClick={() => setShowAssignModal(false)}
                disabled={assignLoading}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleAssignDriver}
                loading={assignLoading}
                disabled={assignLoading}
              >
                Assign
              </Button>
            </div>
          }
        >
          {selectedPickup && (
            <div className="modal-content">
              <div className="info-item">
                <span>Waste Type</span>
                <strong>{selectedPickup.wasteType}</strong>
              </div>
              <div className="info-item">
                <span>Weight</span>
                <strong>{selectedPickup.estimatedWeight} kg</strong>
              </div>
              <div className="info-item">
                <span>Address</span>
                <strong>{selectedPickup.pickupAddress}</strong>
              </div>

              <Input
                label="Driver ID"
                type="number"
                placeholder="Enter driver user ID"
                value={driverId}
                onChange={(e) => setDriverId(e.target.value)}
                required
              />
            </div>
          )}
        </Modal>

        {/* Status Update Modal */}
        <Modal
          isOpen={showStatusModal}
          onClose={() => setShowStatusModal(false)}
          title="Update Pickup Status"
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                variant="secondary"
                onClick={() => setShowStatusModal(false)}
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleStatusUpdate}
              >
                Update
              </Button>
            </div>
          }
        >
          {selectedPickup && (
            <div className="modal-content">
              <div className="info-item">
                <span>Current Status</span>
                <div className={`badge badge-${selectedPickup.status.toLowerCase().replace(" ", "-")}`}>
                  {selectedPickup.status}
                </div>
              </div>
              <div className="info-item">
                <span>Address</span>
                <strong>{selectedPickup.pickupAddress}</strong>
              </div>

              <Select
                label="New Status"
                value={newStatus}
                onChange={(e) => setNewStatus(e.target.value)}
                options={[
                  { label: "Pending", value: "Pending" },
                  { label: "Assigned", value: "Assigned" },
                  { label: "In Progress", value: "In Progress" },
                  { label: "Completed", value: "Completed" },
                  { label: "Cancelled", value: "Cancelled" },
                ]}
                required
              />
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
