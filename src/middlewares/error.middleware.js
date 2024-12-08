// src/middleware/error.middleware.js
const { AppError } = require("../errors");

const errorHandler = async (err, req, res, next) => {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      ...err,
      message: err.message,
      stack: err.stack,
    });
  } else {
    res.status(500).json({
      ...err,
      message: err.message,
      stack: err.stack,
    });
  }
};

module.exports = { errorHandler };
