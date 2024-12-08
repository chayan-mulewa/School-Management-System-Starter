// src/config/cors.config.js
const CORS_CONFIG = {
  LOCAL_ORIGIN: process.env.CORS_LOCAL_ORIGIN || "http://localhost:5173/",
  ONLINE_ORIGIN: process.env.CORS_ONLINE_ORIGIN || "http://localhost:5173/",
};

module.exports = CORS_CONFIG;
