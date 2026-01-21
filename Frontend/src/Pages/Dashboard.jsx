import React from "react";
import "../style/Dashboard.css"

export default function Dashboard() {
  return (
    <div className="layout">

      {/* Sidebar */}
      <aside className="sidebar">
        <h2 className="logo">EcoCycle</h2>

        <ul className="menu">
          <li className="active">🏠 Home</li>
          <li>🕘 History</li>
          <li>🎁 Rewards</li>
          <li>⚙️ Settings</li>
        </ul>

        <div className="user-box">
          <strong>Nirjala Devi</strong>
          <span>Eco Warrior</span>
        </div>
      </aside>

      {/* Main Content */}
      <main className="main">

        {/* Top bar */}
        <div className="topbar">
          <input
            type="text"
            placeholder="Search activities, rewards..."
          />
          <div className="icons">🔔 ❓</div>
        </div>

        {/* Welcome */}
        <h1>Hello, Nirjala! 👋</h1>
        <p className="subtitle">
          Welcome back to your sustainability dashboard. You're doing great!
        </p>

        {/* Stats */}
        <div className="stats">
          <div className="card stat">
            <p>Total Waste Recycled</p>
            <h2>124.5 kg</h2>
            <span className="up">+12%</span>
          </div>

          <div className="card stat">
            <p>Points Earned</p>
            <h2>1,250 pts</h2>
            <div className="progress">
              <div style={{ width: "80%" }}></div>
            </div>
            <small>80% to next reward</small>
          </div>

          <div className="card pickup">
            <h3>Schedule a Pickup</h3>
            <p>Help the planet today 🌍</p>
            <button>Book Pickup Now</button>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom">

          {/* Activity */}
          <div className="card table-card">
            <div className="card-head">
              <h3>Recent Activity</h3>
              <span>View All</span>
            </div>

            <table>
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Type</th>
                  <th>Weight</th>
                  <th>Status</th>
                  <th>Points</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Oct 24</td>
                  <td>Plastic & Glass</td>
                  <td>4.2 kg</td>
                  <td className="done">Completed</td>
                  <td className="plus">+45</td>
                </tr>
                <tr>
                  <td>Oct 21</td>
                  <td>Paper</td>
                  <td>12.8 kg</td>
                  <td className="done">Completed</td>
                  <td className="plus">+120</td>
                </tr>
                <tr>
                  <td>Oct 19</td>
                  <td>E-Waste</td>
                  <td>2.1 kg</td>
                  <td className="pending">Pending</td>
                  <td>—</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Impact */}
          <div className="card impact">
            <h3>Eco Impact 🌱</h3>
            <p>💧 <strong>1,420 L</strong> Water saved</p>
            <p>🌳 <strong>4.5</strong> Trees saved</p>
            <p>⚡ <strong>280 kWh</strong> Energy conserved</p>
          </div>

        </div>

        {/* Tip */}
        <div className="tip">
          💡 <strong>Pro Tip:</strong> Rinsing plastic containers before recycling
          increases their value by <strong>40%</strong>.
        </div>

      </main>
    </div>
  );
}
