import React from "react";
import "./Header.css";

export const Header = ({ title, subtitle, children, actions }) => {
  return (
    <div className="page-header">
      <div className="header-content">
        <div className="header-title">
          <h1>{title}</h1>
          {subtitle && <p>{subtitle}</p>}
        </div>
        {actions && <div className="header-actions">{actions}</div>}
      </div>
      {children && <div className="header-extra">{children}</div>}
    </div>
  );
};

export const PageContainer = ({ children, maxWidth = "1400px" }) => {
  return (
    <div className="page-container" style={{ maxWidth }}>
      {children}
    </div>
  );
};

export default Header;
