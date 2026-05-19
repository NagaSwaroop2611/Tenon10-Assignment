const errorHandler = (err, req, res, next) => {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal server error";

  // Mongoose — bad ObjectId  e.g. /api/products/bad_id
  if (err.name === "CastError") {
    message    = "Resource not found — invalid ID";
    statusCode = 404;
  }

  // Mongoose — duplicate key  e.g. email already exists
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    message    = `${field.charAt(0).toUpperCase() + field.slice(1)} already exists`;
    statusCode = 400;
  }

  // Mongoose — schema validation errors
  if (err.name === "ValidationError") {
    message    = Object.values(err.errors).map((e) => e.message).join(", ");
    statusCode = 400;
  }

  // JWT errors
  if (err.name === "JsonWebTokenError") { message = "Invalid token";  statusCode = 401; }
  if (err.name === "TokenExpiredError") { message = "Token expired — please login again"; statusCode = 401; }
 
  console.error(`❌ [${statusCode}] ${message}`);
 
  res.status(statusCode).json({
    success: false,
    message,
    stack: err.stack,
  });
};

export default errorHandler;