import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Home.css";
import logo from "../assets/ecocycle-logo.png";

const Home = () => {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <div
      className="home-page"
      style={{
        backgroundImage: `
          linear-gradient(rgba(20,83,45,0.75), rgba(20,83,45,0.75)),
          url("https://images.pexels.com/photos/34950/pexels-photo.jpg")
        `,
      }}
    >
      {/* NAVBAR */}
      <nav className="navbar">
        <div className="navbar-container">
          {/* LOGO */}
          <div className="logo-wrapper">
            <img src={logo} alt="EcoCycle Logo" className="logo-img" />
          </div>

          {/* DESKTOP MENU */}
          <div className="nav-menu desktop-only">
            <Link to="/">Home</Link>
            <Link to="/how-it-works">How It Works</Link>
            <Link to="/impact">Impact</Link>
            <Link to="/rewards">Rewards</Link>
          </div>

          {/* DESKTOP ACTIONS */}
          <div className="nav-actions desktop-only">
            <button
              className="login-btn-nav"
              onClick={() => navigate("/login")}
            >
              Log in
            </button>
            <button
              className="signup-btn-nav"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>

          {/* MOBILE HAMBURGER (☰ KEPT) */}
          <button
            className={`hamburger-btn mobile-only ${menuOpen ? "open" : ""}`}
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
            <span></span>
            <span></span>
            <span></span>
          </button>
        </div>

        {/* MOBILE MENU */}
        {menuOpen && (
          <div className="mobile-menu">
            <Link to="/" onClick={() => setMenuOpen(false)}>Home</Link>
            <Link to="/how-it-works" onClick={() => setMenuOpen(false)}>How It Works</Link>
            <Link to="/impact" onClick={() => setMenuOpen(false)}>Impact</Link>
            <Link to="/rewards" onClick={() => setMenuOpen(false)}>Rewards</Link>

            <button
              className="mobile-signup-btn"
              onClick={() => navigate("/signup")}
            >
              Sign up
            </button>
          </div>
        )}
      </nav>

      {/* HERO */}
      <section className="hero-section">
        <h1 className="hero-title">
          Waste less. <br />
          <span>Live greener.</span>
        </h1>

        <p className="hero-description">
          EcoCycle makes recycling simple, rewarding, and impactful.
          Track waste, earn rewards, and help build a cleaner future.
        </p>

        <div className="cta-buttons">
          <button className="btn-primary" onClick={() => navigate("/signup")}>
            Get Started
          </button>
          <button
            className="btn-secondary"
            onClick={() => navigate("/how-it-works")}
          >
            Learn More →
          </button>
        </div>
      </section>
    </div>
  );
};

export default Home;
