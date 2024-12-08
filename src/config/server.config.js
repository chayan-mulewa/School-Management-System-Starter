// src/config/server.config.js
const SERVER_CONFIG = {
  PORT: process.env.SERVER_PORT || 5000,
  NAME: process.env.SERVER_NAME || "server",
  VERSION: process.env.SERVER_VERSION || "v1",
};

module.exports = SERVER_CONFIG;
