import React from "react";
import "./Form.css";

export const FormGroup = ({ 
  label, 
  error, 
  children,
  required = false,
  helperText
}) => {
  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required">*</span>}
        </label>
      )}
      {children}
      {error && <p className="form-error">{error}</p>}
      {helperText && <p className="form-helper">{helperText}</p>}
    </div>
  );
};

export const Input = ({ 
  label, 
  error, 
  type = "text",
  className = "",
  ...props 
}) => {
  return (
    <FormGroup label={label} error={error}>
      <input 
        type={type}
        className={`form-input ${error ? "error" : ""} ${className}`}
        {...props}
      />
    </FormGroup>
  );
};

export const Select = ({ 
  label, 
  error, 
  options = [],
  className = "",
  ...props 
}) => {
  return (
    <FormGroup label={label} error={error}>
      <select 
        className={`form-select ${error ? "error" : ""} ${className}`}
        {...props}
      >
        <option value="">Select an option</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </FormGroup>
  );
};

export const TextArea = ({ 
  label, 
  error, 
  className = "",
  ...props 
}) => {
  return (
    <FormGroup label={label} error={error}>
      <textarea 
        className={`form-textarea ${error ? "error" : ""} ${className}`}
        {...props}
      />
    </FormGroup>
  );
};

export default FormGroup;
