import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input, Select, TextArea, FormGroup } from "../components/Form";
import { Modal } from "../components/Modal";
import { Spinner } from "../components/Loader";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../style/PickupScheduler.css";

export default function ModernPickupScheduler() {
  const [formData, setFormData] = useState({
    wasteType: "",
    estimatedWeight: "",
    pickupAddress: "",
    scheduledTime: "",
  });

  const [loading, setLoading] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errors, setErrors] = useState({});

  const wasteTypes = [
    { label: "Plastic", value: "plastic" },
    { label: "Paper", value: "paper" },
    { label: "Metal", value: "metal" },
    { label: "Glass", value: "glass" },
    { label: "Organic", value: "organic" },
    { label: "E-waste", value: "e-waste" },
    { label: "Mixed", value: "mixed" },
  ];

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.wasteType) {
      newErrors.wasteType = "Waste type is required";
    }

    if (!formData.estimatedWeight) {
      newErrors.estimatedWeight = "Weight is required";
    } else if (parseFloat(formData.estimatedWeight) <= 0) {
      newErrors.estimatedWeight = "Weight must be greater than 0";
    }

    if (!formData.pickupAddress || formData.pickupAddress.trim() === "") {
      newErrors.pickupAddress = "Address is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      toast.error("Please fix the errors in the form");
      return;
    }

    setLoading(true);

    try {
      const response = await api.post("/pickup/request", {
        wasteType: formData.wasteType,
        estimatedWeight: parseFloat(formData.estimatedWeight),
        pickupAddress: formData.pickupAddress,
        scheduledTime: formData.scheduledTime ? new Date(formData.scheduledTime).toISOString() : null,
      });

      if (response.data.success) {
        setSuccessData(response.data.data);
        setShowSuccess(true);
        toast.success("🎉 Pickup request created successfully!");
        setFormData({
          wasteType: "",
          estimatedWeight: "",
          pickupAddress: "",
          scheduledTime: "",
        });
      } else {
        toast.error(response.data.message || "Failed to create pickup request");
      }
    } catch (error) {
      console.error("Pickup request error:", error);
      toast.error(error.response?.data?.message || "Error creating pickup request");
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    { icon: "🏠", label: "Dashboard", href: "/dashboard" },
    { icon: "👤", label: "Profile", href: "/profile" },
    { icon: "♻️", label: "Waste Tracker", href: "/waste-tracker" },
    { icon: "🚚", label: "Schedule Pickup", href: "/schedule-pickup" },
    { icon: "📊", label: "Analytics", href: "/analytics" },
    { icon: "🏆", label: "Leaderboard", href: "/leaderboard" },
    { icon: "🎁", label: "Rewards", href: "/rewards" },
    { icon: "🔔", label: "Notifications", href: "/notifications" },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div className="dashboard-layout">
      <Sidebar items={menuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Schedule Waste Pickup"
          subtitle="Request a convenient waste pickup at your location"
        />

        <PageContainer>
          <div className="scheduler-container">
            <div className="form-section">
              <Card title="Pickup Details">
                <form onSubmit={handleSubmit} className="pickup-form">
                  <Select
                    label="Waste Type"
                    name="wasteType"
                    value={formData.wasteType}
                    onChange={handleChange}
                    options={wasteTypes}
                    required
                  />

                  <Input
                    label="Estimated Weight (kg)"
                    name="estimatedWeight"
                    type="number"
                    placeholder="e.g., 15.5"
                    value={formData.estimatedWeight}
                    onChange={handleChange}
                    step="0.1"
                    min="0"
                    required
                  />

                  <TextArea
                    label="Pickup Address"
                    name="pickupAddress"
                    placeholder="Enter your full address"
                    value={formData.pickupAddress}
                    onChange={handleChange}
                    required
                  />



                  <Input
                    label="Scheduled Time (Optional)"
                    name="scheduledTime"
                    type="datetime-local"
                    value={formData.scheduledTime}
                    onChange={handleChange}
                  />

                  <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    fullWidth
                    loading={loading}
                    disabled={loading}
                  >
                    {loading ? "Creating Request..." : "Request Pickup"}
                  </Button>
                </form>
              </Card>
            </div>

            <div className="info-section">
              <Card title="How It Works" subtitle="Simple 3-step process">
                <div className="steps">
                  <div className="step">
                    <div className="step-number">1</div>
                    <h4>Fill Details</h4>
                    <p>Enter your waste type and location</p>
                  </div>
                  <div className="step">
                    <div className="step-number">2</div>
                    <h4>Request Pickup</h4>
                    <p>Submit your pickup request</p>
                  </div>
                  <div className="step">
                    <div className="step-number">3</div>
                    <h4>Get Picked Up</h4>
                    <p>Driver collects waste & you earn points</p>
                  </div>
                </div>
              </Card>

              <Card title="Tips & Info" className="info-card">
                <ul className="tips-list">
                  <li>Accurate location helps drivers find you faster</li>
                  <li>Schedule pickup during business hours for faster service</li>
                  <li>Segregate waste for better recycling</li>
                  <li>Earn more eco-points with each pickup</li>
                </ul>
              </Card>
            </div>
          </div>
        </PageContainer>

        {/* Success Modal */}
        <Modal
          isOpen={showSuccess}
          onClose={() => setShowSuccess(false)}
          title="Pickup Request Confirmed"
          size="md"
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                variant="secondary"
                onClick={() => setShowSuccess(false)}
                fullWidth
              >
                Close
              </Button>
              <Button
                variant="primary"
                onClick={() => {
                  setShowSuccess(false);
                  window.location.href = "/waste-tracker";
                }}
                fullWidth
              >
                View Pickups
              </Button>
            </div>
          }
        >
          {successData && (
            <div className="success-content">
              <div className="success-detail">
                <span>Waste Type</span>
                <strong>{successData.wasteType}</strong>
              </div>
              <div className="success-detail">
                <span>Weight</span>
                <strong>{successData.estimatedWeight} kg</strong>
              </div>
              <div className="success-detail">
                <span>Status</span>
                <strong className="status-badge status-pending">{successData.status}</strong>
              </div>
              <div className="success-detail">
                <span>Request ID</span>
                <strong style={{ fontSize: "12px", fontFamily: "monospace" }}>
                  {successData.pickupId?.substring(0, 8)}...
                </strong>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
