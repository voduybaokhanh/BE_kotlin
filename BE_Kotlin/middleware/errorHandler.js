// Middleware xử lý lỗi tập trung
const errorHandler = (err, req, res, next) => {
  let error = { ...err };
  error.message = err.message;

  // Log lỗi để debug
  console.error(err);

  // Mongoose bad ObjectId
  if (err.name === 'CastError') {
    const message = `Resource not found with id of ${err.value}`;
    error = { message, status: 404 };
  }

  // Mongoose duplicate key
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    const message = `Duplicate field value entered: ${field}. Please use another value`;
    error = { message, status: 400 };
  }

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const message = Object.values(err.errors).map(val => val.message);
    error = { message, status: 400 };
  }

  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    error = { message: 'Invalid token. Please log in again', status: 401 };
  }

  if (err.name === 'TokenExpiredError') {
    error = { message: 'Your token has expired. Please log in again', status: 401 };
  }

  res.status(error.status || 500).json({
    success: false,
    error: {
      message: error.message || 'Server Error',
      status: error.status || 500
    }
  });
};

module.exports = errorHandler;