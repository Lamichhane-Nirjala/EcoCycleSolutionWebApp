import React from "react";
import "./Card.css";

export const Card = ({ 
  title, 
  subtitle, 
  value, 
  icon, 
  bgColor = "#4ade80",
  onClick,
  children,
  className = ""
}) => {
  return (
    <div 
      className={`card ${className}`} 
      onClick={onClick}
      style={{ "--card-bg": bgColor } }
    >
      {icon && <div className="card-icon">{icon}</div>}
      <div className="card-content">
        {title && <h3 className="card-title">{title}</h3>}
        {value && <p className="card-value">{value}</p>}
        {subtitle && <p className="card-subtitle">{subtitle}</p>}
      </div>
      {children && <div className="card-footer">{children}</div>}
    </div>
  );
};

export const AnalyticsCard = ({ label, value, unit, color, icon }) => {
  return (
    <div className="analytics-card" style={{ borderLeftColor: color }}>
      <div className="analytics-header">
        <span className="analytics-label">{label}</span>
        {icon && <span className="analytics-icon">{icon}</span>}
      </div>
      <div className="analytics-value">
        <span>{value}</span>
        <span className="analytics-unit">{unit}</span>
      </div>
    </div>
  );
};

export default Card;
