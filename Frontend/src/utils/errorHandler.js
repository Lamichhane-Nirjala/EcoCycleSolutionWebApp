import { toast } from "react-toastify";

/**
 * CENTRALIZED ERROR HANDLING AND NOTIFICATION UTILITIES
 * Provides consistent error handling and user notifications across the app
 */

/**
 * Handle API errors and show appropriate toast messages
 * @param {Error} error - The error object
 * @param {Function} setError - State setter for error message
 * @param {string} defaultMessage - Default error message if none provided
 */
export const handleApiError = (error, setError, defaultMessage = "An error occurred") => {
  console.error("API Error:", error);

  const errorMsg = 
    error.response?.data?.message ||
    error.message ||
    defaultMessage;

  if (setError) {
    setError(errorMsg);
  }

  toast.error(errorMsg);
  return errorMsg;
};

/**
 * Handle API success and show toast notification
 * @param {string} message - Success message
 * @param {object} data - Optional data object
 */
export const handleApiSuccess = (message = "Operation successful", data = null) => {
  toast.success(message);
  console.log("Success:", message, data);
  return data;
};

/**
 * Validate form data before submission
 * @param {object} formData - Form data to validate
 * @param {array} requiredFields - Array of required field names
 * @returns {object} - { isValid: boolean, errors: object }
 */
export const validateForm = (formData, requiredFields = []) => {
  const errors = {};

  for (const field of requiredFields) {
    if (!formData[field] || (typeof formData[field] === "string" && !formData[field].trim())) {
      errors[field] = `${field} is required`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean}
 */
export const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Validate password strength
 * @param {string} password - Password to validate
 * @returns {object} - { isStrong: boolean, feedback: string }
 */
export const validatePassword = (password) => {
  if (password.length < 6) {
    return { isStrong: false, feedback: "Password must be at least 6 characters" };
  }
  if (!/[A-Z]/.test(password)) {
    return { isStrong: false, feedback: "Password must contain an uppercase letter" };
  }
  if (!/[0-9]/.test(password)) {
    return { isStrong: false, feedback: "Password must contain a number" };
  }
  return { isStrong: true, feedback: "Password is strong" };
};

/**
 * Handle authentication errors specifically
 * @param {Error} error - The error object
 */
export const handleAuthError = (error) => {
  const status = error.response?.status;
  const message = error.response?.data?.message;

  switch (status) {
    case 401:
      toast.error("Unauthorized - Please login again");
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("isAdmin");
      window.location.href = "/login";
      break;
    case 403:
      toast.error("Forbidden - You don't have permission to access this");
      break;
    case 404:
      toast.error("User or resource not found");
      break;
    default:
      toast.error(message || "Authentication failed");
  }
};

/**
 * Retry failed API calls with exponential backoff
 * @param {Function} apiCall - The API function to call
 * @param {number} maxRetries - Maximum number of retries
 * @param {number} delay - Initial delay in milliseconds
 * @returns {Promise}
 */
export const retryApiCall = async (apiCall, maxRetries = 3, delay = 1000) => {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await apiCall();
    } catch (error) {
      if (i === maxRetries - 1) throw error;
      await new Promise((resolve) => setTimeout(resolve, delay * Math.pow(2, i)));
    }
  }
};

export default {
  handleApiError,
  handleApiSuccess,
  validateForm,
  validateEmail,
  validatePassword,
  handleAuthError,
  retryApiCall,
};
