import React from "react";
import "../style/Impact.css";

function Impact() {
  return (
    <div
      className="impact-page"
      style={{
        backgroundImage: `
          linear-gradient(rgba(20, 83, 45, 0.85), rgba(20, 83, 45, 0.85)),
          url("https://images.pexels.com/photos/34950/pexels-photo.jpg")
        `,
      }}
    >
      <div className="impact-bg-circle circle-1"></div>
      <div className="impact-bg-circle circle-2"></div>

      <div className="impact-container">
        <h1>
          Your <span className="underline-text">Impact</span>
        </h1>

        <p className="impact-subtitle">
          Small actions today create a greener tomorrow.
        </p>

        {/* STATS */}
        <div className="impact-stats">
          <div className="impact-card">
            <span className="impact-icon">♻️</span>
            <h2>500+</h2>
            <p>Tons Recycled</p>
          </div>

          <div className="impact-card">
            <span className="impact-icon">🌳</span>
            <h2>30,000+</h2>
            <p>Trees Saved</p>
          </div>

          <div className="impact-card">
            <span className="impact-icon">🏠</span>
            <h2>20,000+</h2>
            <p>Households</p>
          </div>
        </div>

        {/* FLOW */}
        <div className="impact-flow">
          <h3>How It Helps 🌍</h3>

          <div className="flow-steps">
            <div className="flow-card">🗑️ Separate waste</div>
            <div className="flow-card">🚛 We collect</div>
            <div className="flow-card">🏭 Recycle safely</div>
            <div className="flow-card highlight">🌱 Cleaner future</div>
          </div>
        </div>

        {/* MEANING */}
        <div className="impact-meaning">
          <h3>Why This Matters</h3>
          <p>
            Less pollution, more trees, safer communities, and a healthier
            environment for future generations.
          </p>
        </div>
      </div>
    </div>
  );
}

export default Impact;
