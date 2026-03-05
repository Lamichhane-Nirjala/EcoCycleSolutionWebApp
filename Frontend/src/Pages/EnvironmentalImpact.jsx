import React, { useEffect, useState } from "react";
import api from "../../api/axios";
import { toast } from "react-toastify";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card, AnalyticsCard } from "../components/Card";
import { LoadingPage } from "../components/Loader";
import "../style/Admin.css";

export default function EnvironmentalImpact() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [pickups, setPickups] = useState([]);

  const adminMenuItems = [
    { icon: "📊", label: "Dashboard", href: "/admin-dashboard" },
    { icon: "🚚", label: "Pickups", href: "/admin-pickups" },
    { icon: "👥", label: "Users", href: "/admin-users" },
    { icon: "📈", label: "Analytics", href: "/admin-analytics" },
    { icon: "🌍", label: "Impact", href: "/admin-impact" },
  ];

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pickupsRes, statsRes] = await Promise.all([
        api.get("/pickup/admin/all?limit=1000"),
        api.get("/pickup/admin/stats"),
      ]);

      if (pickupsRes.data.success) {
        setPickups(pickupsRes.data.data || []);
      }
      if (statsRes.data.success) {
        setStats(statsRes.data.data || {});
      }

      toast.success("Impact data updated");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Failed to load impact data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    const refreshInterval = setInterval(fetchData, 30000);
    return () => clearInterval(refreshInterval);
  }, []);

  // Environmental impact calculations
  const totalWasteCollected = pickups.reduce((sum, p) => sum + (p.estimatedWeight || 0), 0);
  const co2Saved = totalWasteCollected * 0.21; // kg CO2 per kg waste diverted from landfill
  const treesSaved = totalWasteCollected * 0.04; // Equivalent trees needed to offset CO2
  const waterSaved = totalWasteCollected * 2.5; // Liters of water saved per kg of plastic recycled
  const energySaved = totalWasteCollected * 1.8; // kWh of energy saved per kg

  // Waste category breakdown for impact
  const wasteByType = pickups.reduce((acc, p) => {
    const type = p.wasteType;
    if (!acc[type]) {
      acc[type] = { count: 0, weight: 0 };
    }
    acc[type].count += 1;
    acc[type].weight += p.estimatedWeight || 0;
    return acc;
  }, {});

  // Calculate impact by waste type
  const impactByType = Object.entries(wasteByType).map(([type, data]) => ({
    type,
    weight: data.weight,
    co2: type === "Plastic" ? data.weight * 0.35 : type === "Paper" ? data.weight * 0.15 : data.weight * 0.21,
    trees: (data.weight * 0.04),
  }));

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage message="Loading environmental data..." />;

  return (
    <div className="dashboard-layout">
      <Sidebar items={adminMenuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Environmental Impact"
          subtitle="Track the positive environmental impact of waste recycling"
        />

        <PageContainer>
          {/* Impact Metrics */}
          <div className="analytics-grid">
            <AnalyticsCard
              label="Total Waste Diverted"
              value={totalWasteCollected.toFixed(1)}
              unit="kg from landfill"
              color="#10b981"
              icon="♻️"
            />
            <AnalyticsCard
              label="CO₂ Emissions Prevented"
              value={co2Saved.toFixed(1)}
              unit="kg CO₂"
              color="#059669"
              icon="🌫️"
            />
            <AnalyticsCard
              label="Trees Worth of Carbon"
              value={treesSaved.toFixed(1)}
              unit="trees planted equivalent"
              color="#7c3aed"
              icon="🌳"
            />
            <AnalyticsCard
              label="Water Preserved"
              value={(waterSaved / 1000).toFixed(1)}
              unit="thousand liters"
              color="#06b6d4"
              icon="💧"
            />
            <AnalyticsCard
              label="Energy Saved"
              value={energySaved.toFixed(1)}
              unit="kWh"
              color="#f59e0b"
              icon="⚡"
            />
            <AnalyticsCard
              label="Landfill Space Saved"
              value={(totalWasteCollected * 0.5).toFixed(1)}
              unit="cubic meters"
              color="#8b5cf6"
              icon="📦"
            />
          </div>

          {/* Impact by Waste Type */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">📊 Impact by Waste Category</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              {impactByType.map((item) => (
                <Card key={item.type}>
                  <div style={{ padding: "16px" }}>
                    <h3 style={{ margin: "0 0 12px 0", fontSize: "16px", fontWeight: "700", color: "#4ade80" }}>
                      {item.type.charAt(0).toUpperCase() + item.type.slice(1)}
                    </h3>
                    <div style={{ fontSize: "12px", color: "#6b7280", lineHeight: "1.8" }}>
                      <p style={{ margin: "4px 0" }}>📦 Weight: {item.weight.toFixed(1)} kg</p>
                      <p style={{ margin: "4px 0" }}>🌫️ CO₂ Prevented: {item.co2.toFixed(1)} kg</p>
                      <p style={{ margin: "4px 0" }}>🌳 Trees Equivalent: {item.trees.toFixed(2)}</p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Impact Breakdown */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">Impact Summary</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <Card>
                <div style={{ padding: "20px", borderLeft: "4px solid #10b981" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#10b981" }}>
                    ♻️ Circular Economy
                  </h3>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
                    By recycling {totalWasteCollected.toFixed(1)} kg of waste, you're keeping valuable resources in circulation and reducing the need for virgin material extraction.
                  </p>
                  <p style={{ margin: "12px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Reduces mining impact
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Preserves natural habitats
                  </p>
                </div>
              </Card>

              <Card>
                <div style={{ padding: "20px", borderLeft: "4px solid #059669" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#059669" }}>
                    Climate Action
                  </h3>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
                    Preventing {co2Saved.toFixed(1)} kg of CO₂ emissions is equivalent to the annual carbon footprint of {(co2Saved / 4752).toFixed(1)} person.
                  </p>
                  <p style={{ margin: "12px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Fights climate change
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Reduces greenhouse gases
                  </p>
                </div>
              </Card>

              <Card>
                <div style={{ padding: "20px", borderLeft: "4px solid #7c3aed" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#7c3aed" }}>
                    Reforestation
                  </h3>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
                    The CO₂ saved is equivalent to planting {treesSaved.toFixed(1)} trees and letting them grow for 10 years.
                  </p>
                  <p style={{ margin: "12px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Supports reforestation
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Improves air quality
                  </p>
                </div>
              </Card>

              <Card>
                <div style={{ padding: "20px", borderLeft: "4px solid #06b6d4" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#06b6d4" }}>
                    💧 Water Conservation
                  </h3>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
                    Recycling instead of producing new materials saves {(waterSaved / 1000).toFixed(1)}k liters of water.
                  </p>
                  <p style={{ margin: "12px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Preserves freshwater
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Protects ecosystems
                  </p>
                </div>
              </Card>

              <Card>
                <div style={{ padding: "20px", borderLeft: "4px solid #f59e0b" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#f59e0b" }}>
                    ⚡ Energy Savings
                  </h3>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
                    Saves {energySaved.toFixed(1)} kWh of energy - enough to power a home for {(energySaved / 30).toFixed(1)} days.
                  </p>
                  <p style={{ margin: "12px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Reduces energy demand
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Lowers emissions
                  </p>
                </div>
              </Card>

              <Card>
                <div style={{ padding: "20px", borderLeft: "4px solid #8b5cf6" }}>
                  <h3 style={{ margin: "0 0 12px 0", fontSize: "14px", fontWeight: "700", color: "#8b5cf6" }}>
                    Landfill Reduction
                  </h3>
                  <p style={{ margin: "0", fontSize: "13px", color: "#6b7280", lineHeight: "1.6" }}>
                    Diverts waste equivalent to {(totalWasteCollected * 0.5).toFixed(1)} cubic meters of landfill space.
                  </p>
                  <p style={{ margin: "12px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Extends landfill life
                  </p>
                  <p style={{ margin: "4px 0 0 0", fontSize: "12px", color: "#9ca3af" }}>
                    ✅ Prevents soil contamination
                  </p>
                </div>
              </Card>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="section" style={{ marginTop: "24px" }}>
            <h2 className="section-title">🎓 Did You Know?</h2>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))",
                gap: "16px",
                marginTop: "16px",
              }}
            >
              <div style={{ padding: "16px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #4ade80" }}>
                <p style={{ margin: "0", fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  Recycling 1 kg of plastic instead of throwing it in landfill saves {(0.35).toFixed(2)} kg of CO₂!
                </p>
              </div>
              <div style={{ padding: "16px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #10b981" }}>
                <p style={{ margin: "0", fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  It takes a tree 10 years to absorb the CO₂ equivalent of recycling {(1/0.04).toFixed(0)} kg of waste!
                </p>
              </div>
              <div style={{ padding: "16px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #06b6d4" }}>
                <p style={{ margin: "0", fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  💧 Making products from recycled materials uses 70% less water than virgin materials!
                </p>
              </div>
              <div style={{ padding: "16px", background: "#f0fdf4", borderRadius: "8px", borderLeft: "4px solid #7c3aed" }}>
                <p style={{ margin: "0", fontSize: "13px", color: "#374151", fontWeight: "500" }}>
                  ⚡ Recycling aluminum saves 95% of the energy needed to make new aluminum!
                </p>
              </div>
            </div>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
