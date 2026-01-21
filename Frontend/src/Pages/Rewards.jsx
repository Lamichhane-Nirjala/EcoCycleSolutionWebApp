import React from "react";
import "../style/Rewards.css";

function Rewards() {
  return (
    <div className="rewards-page">
      <div className="rewards-container">
        <h1>
          Rewards that <span className="underline-text">Matter</span>
        </h1>

        <p className="rewards-desc">
          Earn points for recycling and redeem them for useful, eco-friendly
          rewards.
        </p>

        <div className="rewards-grid">
          <div className="reward-card">
            <span className="reward-icon">🎁</span>
            <h3>Eco Products</h3>
            <p>Reusable bags, bottles & kits</p>
          </div>

          <div className="reward-card">
            <span className="reward-icon">☕</span>
            <h3>Discounts</h3>
            <p>Vouchers from partner brands</p>
          </div>

          <div className="reward-card">
            <span className="reward-icon">🌳</span>
            <h3>Plant Trees</h3>
            <p>Donate points to tree programs</p>
          </div>

          <div className="reward-card">
            <span className="reward-icon">⭐</span>
            <h3>Bonus Points</h3>
            <p>Earn extra on special pickups</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rewards;
