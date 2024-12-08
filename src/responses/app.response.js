// src/responses/app.response.js
class AppResponse {
  constructor(statusCode = 200, message = "Opration Successful", data = null) {
    this.statusCode = statusCode;
    this.message = message;
    this.data = data;
    this.success = true;
  }
}

module.exports = AppResponse;
