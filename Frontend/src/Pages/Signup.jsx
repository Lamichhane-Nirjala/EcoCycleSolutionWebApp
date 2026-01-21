import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../style/Signup.css";
import api from "../../api/axios";

const Signup = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
    phone: "",
    city: "",
    userType: "",
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const validatePassword = (password) => {
    if (password.length < 8) return false;
    if (!/[A-Z]/.test(password)) return false;
    if (!/[0-9]/.test(password)) return false;
    if (!/[!@#$%^&*]/.test(password)) return false;
    return true;
  };

  const handleBlur = (e) => {
    const { name, value } = e.target;
    setTouched({ ...touched, [name]: true });

    let message = "";

    if (!value) message = "This field is required";
    if (name === "confirmPassword" && value !== form.password)
      message = "Passwords do not match";

    setErrors({ ...errors, [name]: message });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    let newErrors = {};

    Object.keys(form).forEach((key) => {
      if (!form[key]) newErrors[key] = "This field is required";
    });

    if (!validatePassword(form.password)) {
      newErrors.password = "Password does not meet requirements";
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match";
    }

    if (Object.keys(newErrors).length) {
      setErrors(newErrors);
      setTouched({
        name: true,
        email: true,
        password: true,
        confirmPassword: true,
        phone: true,
        city: true,
        userType: true,
      });
      return;
    }

    // Call the API to create the user
    createUser();
  };

  const createUser = async () => {
    try {
      const res = await api.post("/auth/create", {
        name: form.name,
        email: form.email,
        password: form.password,
        phone: form.phone,
        city: form.city,
        userType: form.userType,
      });
      alert(res.data.message);
      navigate("/dashboard");
    } catch (err) {
      alert(err.response?.data?.message || "Signup failed");
    }
  };

  return (
    <div
      className="signup-page"
      onClick={() => navigate("/")}
    >
      {/* STOP background click from affecting form */}
      <div
        className="signup-glass"
        onClick={(e) => e.stopPropagation()}
      >
        <h2>Create your account</h2>
        <p className="subtitle">Join the EcoCycle movement 🌱</p>

        <form onSubmit={handleSubmit} noValidate>
          <input
            name="name"
            placeholder="Full name"
            maxLength={40}
            value={form.name}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.name && errors.name && (
            <span className="error">{errors.name}</span>
          )}

          <input
            name="email"
            type="email"
            placeholder="Email address"
            maxLength={50}
            value={form.email}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.email && errors.email && (
            <span className="error">{errors.email}</span>
          )}

          <input
            name="password"
            type="password"
            placeholder="Create password"
            maxLength={20}
            value={form.password}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.password && errors.password && (
            <span className="error">{errors.password}</span>
          )}

          <div className="password-hint">
            Must be 8+ chars, include uppercase, number & symbol
          </div>

          <input
            name="confirmPassword"
            type="password"
            placeholder="Re-type password"
            maxLength={20}
            value={form.confirmPassword}
            onChange={handleChange}
            onBlur={handleBlur}
          />
          {touched.confirmPassword && errors.confirmPassword && (
            <span className="error">{errors.confirmPassword}</span>
          )}

          <input
            name="phone"
            placeholder="Phone number"
            maxLength={15}
            value={form.phone}
            onChange={handleChange}
          />

          <input
            name="city"
            placeholder="City"
            maxLength={25}
            value={form.city}
            onChange={handleChange}
          />

          <select
            name="userType"
            value={form.userType}
            onChange={handleChange}
            onBlur={handleBlur}
          >
            <option value="">Select user type</option>
            <option value="individual">Individual</option>
            <option value="business">Business</option>
          </select>

          <button type="submit" className="primary-btn">Create account</button>
        </form>

        <p className="auth-footer">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;
