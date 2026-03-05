import React, { useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Input, FormGroup } from "../components/Form";
import { Modal } from "../components/Modal";
import { toast } from "react-toastify";
import "../style/WasteScanner.css";

export default function WasteScanner() {
  const [formData, setFormData] = useState({
    itemName: "",
    category: "",
    weight: "",
    material: "",
  });

  const [scannedItems, setScannedItems] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [totalWeight, setTotalWeight] = useState(0);

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

  const categories = [
    { label: "Plastic", value: "plastic" },
    { label: "Paper", value: "paper" },
    { label: "Metal", value: "metal" },
    { label: "Glass", value: "glass" },
    { label: "Organic", value: "organic" },
    { label: "E-waste", value: "e-waste" },
    { label: "Textile", value: "textile" },
    { label: "Other", value: "other" },
  ];

  const materials = {
    plastic: ["PET", "HDPE", "PVC", "LDPE", "PP", "PS", "Other"],
    paper: ["Cardboard", "Office Paper", "Newspaper", "Magazine", "Other"],
    metal: ["Aluminum", "Steel", "Copper", "Brass", "Other"],
    glass: ["Clear", "Brown", "Green", "Clear", "Other"],
    organic: ["Food", "Garden", "Wood", "Textile", "Other"],
    "e-waste": ["Electronics", "Batteries", "Cables", "Components", "Other"],
    textile: ["Cotton", "Polyester", "Wool", "Other"],
    other: ["Unknown", "Mixed"],
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddItem = () => {
    if (!formData.itemName || !formData.category || !formData.weight) {
      toast.error("Please fill all required fields");
      return;
    }

    const weight = parseFloat(formData.weight);
    if (weight <= 0) {
      toast.error("Weight must be greater than 0");
      return;
    }

    const newItem = {
      id: Date.now(),
      ...formData,
      weight: weight,
      ecoPoints: Math.floor(weight * 10), // 10 points per kg
      timestamp: new Date().toLocaleTimeString(),
    };

    setScannedItems([newItem, ...scannedItems]);
    setTotalWeight(totalWeight + weight);
    toast.success(`✓ ${formData.itemName} scanned!`);

    // Reset form
    setFormData({ itemName: "", category: "", weight: "", material: "" });
  };

  const handleRemoveItem = (id) => {
    const item = scannedItems.find((i) => i.id === id);
    if (item) {
      setScannedItems(scannedItems.filter((i) => i.id !== id));
      setTotalWeight(totalWeight - item.weight);
      toast.info("Item removed");
    }
  };

  const handleSubmitScan = async () => {
    if (scannedItems.length === 0) {
      toast.error("Scan at least one item");
      return;
    }

    const token = localStorage.getItem("token");
    const totalPoints = scannedItems.reduce((sum, item) => sum + item.ecoPoints, 0);

    try {
      // Save to backend
      const response = await fetch("http://localhost:5000/api/pickup/request", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          wasteType: "mixed",
          estimatedWeight: totalWeight,
          pickupAddress: "Current Location",
          notes: `Scanned items: ${scannedItems.map((i) => i.itemName).join(", ")}`,
        }),
      });

      const data = await response.json();
      if (data.success) {
        toast.success(
          `🎉 Scan complete! +${totalPoints} Eco Points earned!`
        );
        setScannedItems([]);
        setTotalWeight(0);
        setShowModal(true);
      } else {
        toast.error(data.message || "Failed to submit scan");
      }
    } catch (error) {
      console.error(error);
      toast.error("Error submitting scan");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const totalEcoPoints = scannedItems.reduce((sum, item) => sum + item.ecoPoints, 0);

  return (
    <div className="dashboard-layout">
      <Sidebar items={menuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Waste Scanner"
          subtitle="Scan and catalog waste items in real-time"
        />

        <PageContainer>
          {/* Scanner Stats */}
          <div className="scanner-stats">
            <Card
              title="Items Scanned"
              value={scannedItems.length}
              bgColor="#4ade80"
            />
            <Card
              title="Total Weight"
              value={`${totalWeight.toFixed(1)}`}
              subtitle="kg"
              bgColor="#22c55e"
            />
            <Card
              title="Eco Points"
              value={totalEcoPoints}
              bgColor="#059669"
            />
            <Card
              title="CO₂ Saved"
              value={`${(totalWeight * 0.21).toFixed(1)}`}
              subtitle="kg"
              bgColor="#10b981"
            />
          </div>

          <div className="scanner-container">
            {/* Scanner Form */}
            <div className="scanner-form-section">
              <div className="scanner-card">
                <h3>🔍 Scan Item</h3>

                <FormGroup label="Item Name" required>
                  <Input
                    name="itemName"
                    placeholder="e.g., Plastic Bottle"
                    value={formData.itemName}
                    onChange={handleChange}
                  />
                </FormGroup>

                <FormGroup label="Category" required>
                  <select
                    name="category"
                    value={formData.category}
                    onChange={handleChange}
                    className="form-select"
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat.value} value={cat.value}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </FormGroup>

                {formData.category && (
                  <FormGroup label="Material" required>
                    <select
                      name="material"
                      value={formData.material}
                      onChange={handleChange}
                      className="form-select"
                    >
                      <option value="">Select Material</option>
                      {materials[formData.category]?.map((mat) => (
                        <option key={mat} value={mat}>
                          {mat}
                        </option>
                      ))}
                    </select>
                  </FormGroup>
                )}

                <FormGroup label="Weight (kg)" required>
                  <Input
                    name="weight"
                    type="number"
                    placeholder="0.5"
                    value={formData.weight}
                    onChange={handleChange}
                    min="0.1"
                    step="0.1"
                  />
                </FormGroup>

                <Button
                  variant="primary"
                  fullWidth
                  onClick={handleAddItem}
                >
                  ＋ Add Item
                </Button>
              </div>

              {/* Quick Tips */}
              <div className="scanner-tips">
                <h4>💡 Scanner Tips</h4>
                <ul>
                  <li>Be accurate with weights for better eco points</li>
                  <li>Separate different waste types when possible</li>
                  <li>Each item is worth 10 eco points per kg</li>
                  <li>You can add multiple items before submitting</li>
                </ul>
              </div>
            </div>

            {/* Scanned Items List */}
            <div className="scanned-items-section">
              <h3>📋 Scanned Items ({scannedItems.length})</h3>

              {scannedItems.length === 0 ? (
                <div className="empty-scan">
                  <p>No items scanned yet</p>
                  <p className="text-muted">Start scanning items to begin!</p>
                </div>
              ) : (
                <>
                  <div className="items-list">
                    {scannedItems.map((item) => (
                      <div key={item.id} className="scan-item">
                        <div className="item-info">
                          <div className="item-name">{item.itemName}</div>
                          <div className="item-details">
                            <span className="badge-category">{item.category}</span>
                            <span className="badge-material">{item.material}</span>
                          </div>
                          <div className="item-meta">
                            <span>⏱ {item.timestamp}</span>
                          </div>
                        </div>

                        <div className="item-stats">
                          <div className="stat">
                            <span className="stat-label">Weight</span>
                            <strong>{item.weight} kg</strong>
                          </div>
                          <div className="stat">
                            <span className="stat-label">Eco Points</span>
                            <strong className="points">+{item.ecoPoints}</strong>
                          </div>
                          <button
                            className="btn-remove"
                            onClick={() => handleRemoveItem(item.id)}
                            title="Remove item"
                          >
                            ✕
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="scan-summary">
                    <div className="summary-row">
                      <span>Total Items:</span>
                      <strong>{scannedItems.length}</strong>
                    </div>
                    <div className="summary-row">
                      <span>Total Weight:</span>
                      <strong>{totalWeight.toFixed(2)} kg</strong>
                    </div>
                    <div className="summary-row highlight">
                      <span>Total Eco Points:</span>
                      <strong className="points">+{totalEcoPoints}</strong>
                    </div>
                  </div>

                  <Button
                    variant="primary"
                    fullWidth
                    onClick={handleSubmitScan}
                  >
                    ✓ Submit Scan & Create Pickup
                  </Button>
                </>
              )}
            </div>
          </div>
        </PageContainer>
      </main>

      {/* Success Modal */}
      <Modal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        title="Scan Submitted ✓"
      >
        <div style={{ textAlign: "center" }}>
          <p style={{ fontSize: "48px", margin: "16px 0" }}>🎉</p>
          <h3>Great Job!</h3>
          <p>
            You've scanned <strong>{scannedItems.length} items</strong> weighing{" "}
            <strong>{totalWeight.toFixed(1)} kg</strong>
          </p>
          <p style={{ fontSize: "18px", color: "#4ade80", fontWeight: "bold" }}>
            +{totalEcoPoints} Eco Points Earned! 🌱
          </p>
          <p style={{ color: "#6b7280", marginTop: "16px" }}>
            Your pickup request has been created. Track it in the Waste Tracker.
          </p>
          <Button variant="primary" fullWidth onClick={() => setShowModal(false)}>
            Close
          </Button>
        </div>
      </Modal>
    </div>
  );
}
