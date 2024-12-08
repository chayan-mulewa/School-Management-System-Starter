// src/errors/FieldError.js
const AppError = require("./app.error");

class FieldError extends AppError {
  constructor(name = "field", message = "Invalid Error", statusCode = 400) {
    super(message);
    this.name = name;
    this.message = message;
    this.statusCode = statusCode;
  }
}

module.exports = FieldError;
