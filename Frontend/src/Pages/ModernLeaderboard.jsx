import React, { useEffect, useState } from "react";
import { Sidebar } from "../components/Sidebar";
import { Header, PageContainer } from "../components/Header";
import { Card } from "../components/Card";
import { Button } from "../components/Button";
import { LoadingPage } from "../components/Loader";
import { toast } from "react-toastify";
import api from "../../api/axios";
import "../style/Leaderboard.css";

export default function Leaderboard() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

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

  useEffect(() => {
    fetchLeaderboardData();
    
    // Auto-refresh leaderboard every 30 seconds for real-time updates
    const refreshInterval = setInterval(fetchLeaderboardData, 30000);
    
    return () => clearInterval(refreshInterval);
  }, []);

  const fetchLeaderboardData = async () => {
    try {
      setLoading(true);
      // Fetch top users from admin API
      const response = await api.get("/admin/dashboard");
      
      if (response.data.success && response.data.data.topUsers) {
        const topUsers = response.data.data.topUsers;
        
        // Transform admin data into leaderboard format
        const leaderboardData = topUsers.map((user, idx) => {
          const ecoPoints = (user.pickups * 10) + (user.waste * 1);
          const rank = idx < 3 ? (idx === 0 ? "🥇 Gold" : idx === 1 ? "🥈 Silver" : "🥉 Bronze") : "Green";
          
          return {
            id: user.id,
            name: user.name || user.email,
            points: ecoPoints,
            waste: user.waste || 0,
            rank: rank,
            pickups: user.pickups,
          };
        });
        
        setUsers(leaderboardData);
      } else {
        toast.error("Failed to load leaderboard data");
      }
    } catch (error) {
      console.error("Leaderboard error:", error);
      toast.error(error.response?.data?.message || "Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  if (loading) return <LoadingPage />;

  return (
    <div className="dashboard-layout">
      <Sidebar items={menuItems} onLogout={handleLogout} />

      <main className="main-content">
        <Header
          title="Eco Leaderboard"
          subtitle="Top performers in waste recycling and eco-consciousness"
        />

        <PageContainer>
          {/* Top 3 Highlights */}
          <div className="top-performers">
            {users.slice(0, 3).map((user, idx) => (
              <Card
                key={user.id}
                title={user.rank}
                value={user.name}
                className={`top-card rank-${idx + 1}`}
              >
                <div className="top-card-stats">
                  <div className="stat">
                    <span>⭐ Points</span>
                    <strong>{user.points}</strong>
                  </div>
                  <div className="stat">
                    <span>♻️ Waste</span>
                    <strong>{user.waste} kg</strong>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Full Leaderboard Table */}
          <div className="leaderboard-table">
            <table>
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Name</th>
                  <th>Eco Points</th>
                  <th>Total Waste (kg)</th>
                  <th>Badge</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user, idx) => (
                  <tr key={user.id} className={idx < 3 ? "highlighted" : ""}>
                    <td className="rank-cell">
                      <span className="rank-number">#{idx + 1}</span>
                    </td>
                    <td className="name-cell">{user.name}</td>
                    <td className="points-cell">
                      <strong>{user.points}</strong>
                    </td>
                    <td className="waste-cell">{user.waste}</td>
                    <td className="badge-cell">{user.rank}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Info Section */}
          <div className="leaderboard-info">
            <Card title="How to Rank Up" subtitle="Climb the leaderboard">
              <div className="ranking-rules">
                <div className="rule">
                  <div className="rule-icon">♻️</div>
                  <div>
                    <h4>Request Pickups</h4>
                    <p>100 points per pickup request</p>
                  </div>
                </div>
                <div className="rule">
                  <div className="rule-icon">📦</div>
                  <div>
                    <h4>Completed Pickups</h4>
                    <p>50 points per completed pickup</p>
                  </div>
                </div>
                <div className="rule">
                  <div className="rule-icon">⭐</div>
                  <div>
                    <h4>High Volume</h4>
                    <p>Bonus points for 50+ kg recycled</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </PageContainer>
      </main>
    </div>
  );
}
