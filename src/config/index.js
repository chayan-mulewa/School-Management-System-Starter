// src/config/index.js
const SERVER_CONFIG = require("./server.config");
const CORS_CONFIG = require("./cors.config");
const DATABASE = require("./db.config");
const JWT_CONFIG = require("./jwt.config");

module.exports = {
  SERVER_CONFIG,
  CORS_CONFIG,
  DATABASE,
  JWT_CONFIG,
};
