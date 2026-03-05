import React, { useState, useEffect } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { Modal } from "../components/Modal";
import { LoadingPage } from "../components/Loader";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../style/Rewards.css";

export default function Rewards() {
  const [userPoints, setUserPoints] = useState(0);
  const [loading, setLoading] = useState(true);
  const [showRedeemModal, setShowRedeemModal] = useState(false);
  const [selectedReward, setSelectedReward] = useState(null);

  useEffect(() => {
    fetchUserPoints();
    
    // Auto-refresh rewards data every 30 seconds
    const refreshInterval = setInterval(fetchUserPoints, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchUserPoints = async () => {
    try {
      setLoading(true);
      const response = await api.get("/dashboard/");
      
      if (response.data.success && response.data.data.stats) {
        setUserPoints(response.data.data.stats.ecoPoints || 0);
      } else {
        toast.error("Failed to load user points");
        setUserPoints(0);
      }
    } catch (error) {
      console.error("Error fetching user points:", error);
      toast.error("Failed to load user points");
      setUserPoints(0);
    } finally {
      setLoading(false);
    }
  }

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

  const rewards = [
    {
      id: 1,
      name: "5% Discount Coupon",
      description: "Get 5% off on eco-friendly products",
      points: 250,
      icon: "🎟️",
      category: "discount",
    },
    {
      id: 2,
      name: "Free Reusable Bag",
      description: "Premium eco-friendly shopping bag",
      points: 350,
      icon: "Bag",
      category: "merchandise",
    },
    {
      id: 3,
      name: "Tree Planting Certificate",
      description: "Plant a tree in your name",
      points: 500,
      icon: "Tree",
      category: "charity",
    },
    {
      id: 4,
      name: "10% Discount Coupon",
      description: "Get 10% off on all products",
      points: 500,
      icon: "💳",
      category: "discount",
    },
    {
      id: 5,
      name: "Eco-Kit Bundle",
      description: "Complete sustainability starter kit",
      points: 750,
      icon: "Kit",
      category: "merchandise",
    },
    {
      id: 6,
      name: "Virtual Workshop Pass",
      description: "Access exclusive sustainability workshops",
      points: 600,
      icon: "📚",
      category: "learning",
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  const handleRedeem = () => {
    if (userPoints >= selectedReward.points) {
      setUserPoints(userPoints - selectedReward.points);
      toast.success(`${selectedReward.name} redeemed successfully!`);
      setShowRedeemModal(false);
    } else {
      toast.error("Insufficient eco points");
    }
  };

  const categoryEmoji = {
    discount: "💰",
    merchandise: "🛍",
    charity: "❤️",
    learning: "📖",
  };

  return (
    <div className="dashboard-layout">
      <Sidebar items={menuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Eco Rewards"
          subtitle="Redeem your eco points for amazing rewards"
        />

        {loading ? (
          <LoadingPage message="Loading your rewards..." />
        ) : (
        <PageContainer>
          {/* Points Balance */}
          <Card
            title="Your Eco Points"
            value={userPoints}
            className="points-card"
          >
            <div className="points-info">
              <p>
                Earn more points by scheduling waste pickups and completing
                recycling activities
              </p>
            </div>
          </Card>

          {/* Category Filters */}
          <div className="rewards-categories">
            <Button variant="primary" size="sm">
              All Rewards
            </Button>
            <Button variant="secondary" size="sm">
              Discounts
            </Button>
            <Button variant="secondary" size="sm">
              Merchandise
            </Button>
            <Button variant="secondary" size="sm">
              Charity
            </Button>
            <Button variant="secondary" size="sm">
              Learning
            </Button>
          </div>

          {/* Rewards Grid */}
          <div className="rewards-grid">
            {rewards.map((reward) => (
              <Card
                key={reward.id}
                title={`${categoryEmoji[reward.category]} ${reward.name}`}
                subtitle={reward.description}
                className="reward-card"
              >
                <div className="reward-footer">
                  <div className="reward-points">
                    <span>⭐ {reward.points} points</span>
                  </div>
                  <Button
                    variant={userPoints >= reward.points ? "primary" : "secondary"}
                    size="sm"
                    onClick={() => {
                      setSelectedReward(reward);
                      setShowRedeemModal(true);
                    }}
                    disabled={userPoints < reward.points}
                  >
                    {userPoints >= reward.points ? "Redeem" : "Locked"}
                  </Button>
                </div>
              </Card>
            ))}
          </div>

          {/* Points History */}
          <div className="points-history">
            <h2 className="section-title">Recent Activity</h2>
            <div className="history-list">
              <div className="history-item">
                <div className="history-icon">+100</div>
                <div className="history-details">
                  <p>Scheduled waste pickup</p>
                  <span>2 hours ago</span>
                </div>
              </div>
              <div className="history-item">
                <div className="history-icon">+50</div>
                <div className="history-details">
                  <p>Completed recycling activity</p>
                  <span>5 hours ago</span>
                </div>
              </div>
              <div className="history-item">
                <div className="history-icon">-250</div>
                <div className="history-details">
                  <p>Redeemed: 5% Discount Coupon</p>
                  <span>1 day ago</span>
                </div>
              </div>
            </div>
          </div>
        </PageContainer>
        )}

        {/* Redeem Modal */}
        <Modal
          isOpen={showRedeemModal}
          onClose={() => setShowRedeemModal(false)}
          title="Confirm Redemption"
          footer={
            <div style={{ display: "flex", gap: "12px" }}>
              <Button
                variant="secondary"
                onClick={() => setShowRedeemModal(false)}
                fullWidth
              >
                Cancel
              </Button>
              <Button
                variant="primary"
                onClick={handleRedeem}
                fullWidth
                disabled={userPoints < (selectedReward?.points || 0)}
              >
                Redeem Now
              </Button>
            </div>
          }
        >
          {selectedReward && (
            <div className="redeem-content">
              <div className="redeem-item">
                <span>Reward</span>
                <strong>{selectedReward.name}</strong>
              </div>
              <div className="redeem-item">
                <span>Cost</span>
                <strong>⭐ {selectedReward.points} points</strong>
              </div>
              <div className="redeem-item">
                <span>Your Balance</span>
                <strong style={{ color: userPoints >= selectedReward.points ? "#4ade80" : "#ef4444" }}>
                  ⭐ {userPoints} points
                </strong>
              </div>
              <div className="redeem-item">
                <span>After Redemption</span>
                <strong>⭐ {userPoints - selectedReward.points} points</strong>
              </div>
            </div>
          )}
        </Modal>
      </main>
    </div>
  );
}
