/**
 * REQUEST VALIDATION MIDDLEWARE
 * Validates common patterns to prevent bad requests
 */

export const validateRegister = (req, res, next) => {
  const { name, email, password, phone, city } = req.body;

  const errors = [];

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    errors.push("Name is required and must be a non-empty string");
  }

  if (!email || !isValidEmail(email)) {
    errors.push("Email is invalid");
  }

  if (!password || password.length < 6) {
    errors.push("Password must be at least 6 characters");
  }

  if (phone && phone.length < 10) {
    errors.push("Phone number should be at least 10 digits");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !isValidEmail(email)) {
    return res.status(400).json({
      success: false,
      message: "Email is required and must be valid",
    });
  }

  if (!password || password.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Password is required",
    });
  }

  next();
};

export const validatePickupRequest = (req, res, next) => {
  const { wasteType, estimatedWeight, pickupAddress } = req.body;

  const errors = [];

  if (!wasteType || typeof wasteType !== "string") {
    errors.push("Waste type is required");
  }

  if (!estimatedWeight || isNaN(estimatedWeight) || estimatedWeight <= 0) {
    errors.push("Estimated weight must be a positive number");
  }

  if (!pickupAddress || typeof pickupAddress !== "string" || pickupAddress.trim().length === 0) {
    errors.push("Pickup address is required");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

export const validateUpdateUser = (req, res, next) => {
  const { email, phone, city, username } = req.body;

  const errors = [];

  if (email && !isValidEmail(email)) {
    errors.push("Email format is invalid");
  }

  if (phone && (phone.length < 10 || phone.length > 20)) {
    errors.push("Phone number must be between 10-20 characters");
  }

  if (username && (username.length < 2 || username.length > 100)) {
    errors.push("Username must be between 2-100 characters");
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      message: "Validation failed",
      errors,
    });
  }

  next();
};

/**
 * Helper function to validate email format
 */
function isValidEmail(email) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate waste type against allowed types
 */
export const validateWasteType = (wasteType) => {
  const allowedTypes = ["plastic", "paper", "glass", "organic", "metal", "mixed"];
  return allowedTypes.includes(wasteType.toLowerCase());
};

/**
 * Get list of valid waste types
 */
export const getValidWasteTypes = () => {
  return ["plastic", "paper", "glass", "organic", "metal", "mixed"];
};
