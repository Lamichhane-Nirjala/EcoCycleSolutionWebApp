/**
 * GLOBAL ERROR HANDLER MIDDLEWARE
 * This middleware should be used at the end of all routes
 * to catch and handle all errors consistently
 */

export const errorHandler = (err, req, res, next) => {
  console.error("Error:", err);

  // Set default status code and message
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";

  // Handle specific error types
  if (err.name === "ValidationError") {
    statusCode = 400;
    message = "Validation Error";
  } else if (err.name === "UnauthorizedError") {
    statusCode = 401;
    message = "Unauthorized";
  } else if (err.name === "NotFoundError") {
    statusCode = 404;
    message = "Not Found";
  } else if (err.name === "ForbiddenError") {
    statusCode = 403;
    message = "Forbidden";
  }

  // Sequelize specific errors
  if (err.name === "SequelizeUniqueConstraintError") {
    statusCode = 400;
    message = "This record already exists";
  } else if (err.name === "SequelizeValidationError") {
    statusCode = 400;
    message = "Validation failed";
  }

  // Return error response
  res.status(statusCode).json({
    success: false,
    message,
    ...(process.env.NODE_ENV === "development" && { error: err.message }),
  });
};

/**
 * 404 NOT FOUND HANDLER
 * This middleware should be used before errorHandler
 */
export const notFoundHandler = (req, res, next) => {
  const error = new Error(`Not found - ${req.originalUrl}`);
  error.statusCode = 404;
  error.name = "NotFoundError";
  next(error);
};

/**
 * ASYNC ERROR WRAPPER
 * Wrap async route handlers to catch errors
 */
export const asyncHandler = (fn) => (req, res, next) => {
  Promise.resolve(fn(req, res, next)).catch(next);
};
