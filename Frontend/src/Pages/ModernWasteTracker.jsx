import React, { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Table } from "../components/Table";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { LoadingPage } from "../components/Loader";
import api from "../../api/axios";
import "../style/WasteTracker.css";

export default function ModernWasteTracker() {

  const [pickups, setPickups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPickup, setSelectedPickup] = useState(null);
  const [showDetails, setShowDetails] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchPickups();
  }, []);

  const fetchPickups = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await api.get("/pickup/my-pickups");

      if (response.data.success) {
        setPickups(response.data.data || []);
        toast.success(`Loaded ${response.data.data?.length || 0} pickups`);
      } else {
        const errorMsg = response.data.message || "Failed to fetch pickups";
        setError(errorMsg);
        toast.error(errorMsg);
      }

    } catch (error) {

      console.error("Fetch pickups error:", error);

      const message =
        error.response?.data?.message || "Failed to fetch pickups";

      setError(message);
      toast.error(message);

    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: "🏠", label: "Dashboard", href: "/dashboard" },
    { icon: "♻️", label: "Waste Tracker", href: "/waste-tracker" },
    { icon: "🚚", label: "Schedule Pickup", href: "/schedule-pickup" },
    { icon: "📊", label: "Analytics", href: "/analytics" },
    { icon: "🏆", label: "Leaderboard", href: "/leaderboard" },
    { icon: "🎁", label: "Rewards", href: "/rewards" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("isAdmin");
    window.location.href = "/login";
  };

  const statusBadge = (status) => (
    <div className={`badge badge-${status.toLowerCase().replace(" ", "-")}`}>
      {status}
    </div>
  );

  const columns = [
    { key: "wasteType", label: "Waste Type", width: "120px" },

    {
      key: "estimatedWeight",
      label: "Weight",
      render: (weight) => `${weight} kg`,
      width: "100px",
    },

    { key: "pickupAddress", label: "Address", width: "250px" },

    {
      key: "status",
      label: "Status",
      render: statusBadge,
      width: "120px",
    },

    {
      key: "requestedAt",
      label: "Requested",
      render: (date) => new Date(date).toLocaleDateString(),
      width: "120px",
    },
  ];

  if (loading) {
    return <LoadingPage message="Loading your waste tracker..." />;
  }

  return (
    <div className="dashboard-layout">

      <Sidebar items={menuItems} onLogout={handleLogout} />

      <main className="main-content">

        <Header
          title="Waste Tracker 📊"
          subtitle="Monitor all your waste pickups and recycling history"
        />

        <PageContainer>

          {error && (
            <div
              style={{
                padding: "12px 16px",
                backgroundColor: "#fee",
                color: "#c00",
                borderRadius: "4px",
                marginBottom: "20px",
                border: "1px solid #fcc",
              }}
            >
              {error}
            </div>
          )}

          {/* Stats */}
          <div className="tracker-stats">

            <div className="stat-card">
              <div className="stat-value">{pickups.length}</div>
              <div className="stat-label">Total Pickups</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {(
                  pickups.reduce(
                    (sum, p) => sum + parseFloat(p.estimatedWeight || 0),
                    0
                  )
                ).toFixed(1)}
              </div>
              <div className="stat-label">Total Weight (kg)</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {pickups.filter((p) => p.status === "Completed").length}
              </div>
              <div className="stat-label">Completed</div>
            </div>

            <div className="stat-card">
              <div className="stat-value">
                {pickups.filter((p) => p.status === "Pending").length}
              </div>
              <div className="stat-label">Pending</div>
            </div>

          </div>

          {/* Table */}

          <div className="tracker-table">

            {pickups.length === 0 ? (

              <div
                style={{
                  textAlign: "center",
                  padding: "40px 20px",
                  color: "#666",
                }}
              >
                No pickups found. Start recycling to schedule your first pickup!
              </div>

            ) : (

              <Table
                columns={columns}
                data={pickups}
                loading={loading}
                onRowClick={(row) => {
                  setSelectedPickup(row);
                  setShowDetails(true);
                }}
                actions={(row) => (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedPickup(row);
                      setShowDetails(true);
                    }}
                  >
                    View
                  </Button>
                )}
              />

            )}

          </div>

        </PageContainer>

        {/* Modal */}

        <Modal
          isOpen={showDetails}
          onClose={() => setShowDetails(false)}
          title="Pickup Details"
          size="md"
        >

          {selectedPickup && (

            <div className="details-content">

              <div className="detail-row">
                <span>Waste Type</span>
                <strong>{selectedPickup.wasteType}</strong>
              </div>

              <div className="detail-row">
                <span>Weight</span>
                <strong>{selectedPickup.estimatedWeight} kg</strong>
              </div>

              <div className="detail-row">
                <span>Address</span>
                <strong>{selectedPickup.pickupAddress}</strong>
              </div>

              <div className="detail-row">
                <span>Status</span>
                {statusBadge(selectedPickup.status)}
              </div>

              <div className="detail-row">
                <span>Requested</span>
                <strong>
                  {new Date(selectedPickup.requestedAt).toLocaleString()}
                </strong>
              </div>

              {selectedPickup.scheduledTime && (
                <div className="detail-row">
                  <span>Scheduled</span>
                  <strong>
                    {new Date(selectedPickup.scheduledTime).toLocaleString()}
                  </strong>
                </div>
              )}

              {selectedPickup.completedAt && (
                <div className="detail-row">
                  <span>Completed</span>
                  <strong>
                    {new Date(selectedPickup.completedAt).toLocaleString()}
                  </strong>
                </div>
              )}

              {selectedPickup.notes && (
                <div className="detail-row">
                  <span>Notes</span>
                  <strong>{selectedPickup.notes}</strong>
                </div>
              )}

              <div className="detail-row">
                <span>Request ID</span>
                <strong
                  style={{
                    fontSize: "11px",
                    fontFamily: "monospace",
                  }}
                >
                  {selectedPickup.pickupId}
                </strong>
              </div>

            </div>

          )}

        </Modal>

      </main>
    </div>
  );
}