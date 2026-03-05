import React from "react";
import "../style/HowItWorks.css";


function HowItWorks() {
  return (
    <div
      className="how-page"
      style={{
        backgroundImage: `
          linear-gradient(rgba(20,83,45,0.75), rgba(20,83,45,0.75)),
          url("https://images.pexels.com/photos/34950/pexels-photo.jpg")
        `,
      }}
    >
      <div className="how-container">
        <h1>
          How <span className="underline-text">EcoCycle</span> Works
        </h1>

        <p className="how-subtitle">
          A simple flow designed to make recycling effortless.
        </p>

        {/* STEPS */}
        <div className="how-steps">
          <div className="how-step">
            <span>1</span>
            <h4>Separate Waste</h4>
            <p>Sort recyclable waste at home.</p>
          </div>

          <div className="how-step">
            <span>2</span>
            <h4>Log in App</h4>
            <p>Schedule or record collection.</p>
          </div>

          <div className="how-step">
            <span>3</span>
            <h4>We Collect</h4>
            <p>Collected and processed safely.</p>
          </div>

          <div className="how-step highlight">
            <span>4</span>
            <h4>Earn Rewards</h4>
            <p>Get points & track impact.</p>
          </div>
        </div>

        {/* EXTRA APP INFO */}
        <div className="how-extra">
          <div className="extra-box">Track recycling history</div>
          <div className="extra-box">See your impact</div>
          <div className="extra-box">Redeem rewards</div>
          <div className="extra-box">Help your city</div>
        </div>
      </div>
    </div>
  );
}

export default HowItWorks;
