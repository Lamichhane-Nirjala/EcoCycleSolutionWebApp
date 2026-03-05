import React, { useState } from "react";
import "./Sidebar.css";

export const Sidebar = ({ items, userInfo, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {isOpen && (
        <div className="sidebar-overlay" onClick={() => setIsOpen(false)} />
      )}
      
      <aside className={`sidebar ${isOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <div className="logo">
            <span className="logo-icon">🌱</span>
            <span className="logo-text">EcoCycle</span>
          </div>
          <button 
            className="sidebar-close"
            onClick={() => setIsOpen(false)}
          >
            ×
          </button>
        </div>

        <nav className="sidebar-nav">
          {items.map((item, idx) => (
            <a
              key={idx}
              href={item.href}
              className="nav-item"
              title={item.label}
            >
              <span className="nav-icon">{item.icon}</span>
              <span className="nav-label">{item.label}</span>
            </a>
          ))}
        </nav>

        <div className="sidebar-footer">
          {userInfo && (
            <div className="user-info">
              <div className="user-avatar">
                {userInfo.name?.charAt(0).toUpperCase()}
              </div>
              <div className="user-details">
                <p className="user-name">{userInfo.name}</p>
                <p className="user-email">{userInfo.email}</p>
              </div>
            </div>
          )}
          <button className="logout-btn" onClick={onLogout}>
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      <button 
        className="sidebar-toggle"
        onClick={() => setIsOpen(!isOpen)}
      >
        ☰
      </button>
    </>
  );
};

export default Sidebar;
