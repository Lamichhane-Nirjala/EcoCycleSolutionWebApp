import React from "react";
import "./Button.css";

export const Button = ({
  children,
  variant = "primary",
  size = "md",
  fullWidth = false,
  disabled = false,
  icon,
  loading = false,
  className = "",
  ...props
}) => {
  return (
    <button
      className={`btn btn-${variant} btn-${size} ${fullWidth ? "btn-full" : ""} ${className}`}
      disabled={disabled || loading}
      {...props}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {loading ? <span className="btn-loader"></span> : children}
    </button>
  );
};

export default Button;
