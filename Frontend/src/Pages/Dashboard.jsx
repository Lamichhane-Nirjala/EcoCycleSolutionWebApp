import React, { useEffect, useState } from "react";
import "../style/Dashboard.css";

import WasteChart from "../Pages/WasteChart";
import EcoPointsTracker from "../Pages/EcoPointsTracker";
import PickupScheduler from "../Pages/PickupScheduler";
import RecentActivity from "../Pages/RecentActivity";
import { Link } from "react-router-dom";
import WasteTracker from "../Pages/WasteTracker";

export default function Dashboard() {

  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  const [wasteType, setWasteType] = useState("");
  const [scanResult, setScanResult] = useState(null);

  useEffect(() => {

    const token = localStorage.getItem("token");

    if (!token) {
      setLoading(false);
      return;
    }

    fetch("http://localhost:5000/api/auth/me", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {

        if (data.success) {
          setUser(data.user);
        }

        setLoading(false);
      })
      .catch(err => {
        console.error(err);
        setLoading(false);
      });

  }, []);

  if (loading) return <p>Loading dashboard...</p>;

  if (!user) {
    return (
      <div style={{ padding: "40px" }}>
        <h2>User not logged in</h2>
        <p>Please login again.</p>
      </div>
    );
  }

  const firstName = user.name.split(" ")[0];

  const handleScan = () => {

    if (!wasteType) {
      alert("Select waste type");
      return;
    }

    const token = localStorage.getItem("token");

    fetch("http://localhost:5000/api/waste/scan", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`
      },
      body: JSON.stringify({ wasteType })
    })
      .then(res => res.json())
      .then(data => {

        setScanResult(data);

        setUser(prev => ({
          ...prev,
          points: prev.points + (data.points || 0)
        }));

      })
      .catch(err => console.error(err));

  };

  return (
    <div className="dashboard">

      {/* Overlay for mobile sidebar */}
      {menuOpen && (
        <div
          className="overlay"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${menuOpen ? "open" : ""}`}>

        <h2 className="logo">EcoCycle</h2>

        <nav className="menu">
          <a className="active">Dashboard</a>
          <a>Waste Tracker</a>
          <a>Pickup</a>
          <a>Rewards</a>
          <a>Marketplace</a>
          <a>Learning</a>
          <a>Settings</a>
        </nav>

        <div className="userBox">

          <div className="avatar">
            {user.name.charAt(0)}
          </div>

          <div>
            <strong>{user.name}</strong>
            <p>{user.role || "Eco Warrior"}</p>
          </div>

        </div>

      </aside>

      {/* MAIN CONTENT */}
      <main className="content">

        {/* TOPBAR */}
        <header className="topbar">

          <button
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            ☰
          </button>

          <input placeholder="Search activity..." />

          <div className="icons">
            🔔
            ❓
          </div>

        </header>

        {/* WELCOME */}
        <section className="welcome">

          <h1>Hello {firstName} 👋</h1>
          <p>Your sustainability dashboard</p>

        </section>

        {/* STATS */}
        <section className="stats">

          <div className="card">
            <p>Total Waste</p>
            <h2>{user.totalWaste || 0} kg</h2>
          </div>

          <div className="card">
            <p>Eco Points</p>
            <h2>{user.points || 0}</h2>
          </div>

          <div className="card pickupCard">
            <h3>Next Pickup</h3>
            <p>No pickup scheduled</p>
            <button>Schedule Pickup</button>
          </div>

        </section>

        {/* ANALYTICS DASHBOARD */}
        <section className="analytics">

          <div className="analytics-left">
            <WasteChart />
          </div>

          <div className="analytics-right">

            <EcoPointsTracker />

            <PickupScheduler />

            <RecentActivity />

          </div>

        </section>

        {/* WASTE SCANNER */}
        <section className="card scanner">

          <h3>Identify Waste</h3>

          <select
            value={wasteType}
            onChange={(e) => setWasteType(e.target.value)}
          >
            <option value="">Select waste type</option>
            <option value="Plastic">Plastic</option>
            <option value="Paper">Paper</option>
            <option value="Glass">Glass</option>
            <option value="Organic">Organic</option>
            <option value="Metal">Metal</option>
          </select>

          <button onClick={handleScan}>
            Scan Waste
          </button>

          {scanResult && (
            <div className="scan-result">
              <strong>{scanResult.category}</strong>
              <p>+{scanResult.points} Eco Points</p>
            </div>
          )}

        </section>

      </main>

    </div>
  );
}