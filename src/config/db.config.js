// src/config/db.config.js
const DATABASE = {
  LOCAL: process.env.DATABASE_LOCAL_URI || "localhost",
  ONLINE: process.env.DATABASE_ONLINE_URI || "localhost",
  USERNAME: process.env.DATABASE_USERNAME || "root",
  PASSWORD: process.env.DATABASE_PASSWORD || "",
  PORT: process.env.DATABASE_PORT || 3306,
  NAME: process.env.DATABASE_NAME || "test",
  DIALECT: process.env.DATABASE_DIALECT || "mysql",
};

module.exports = DATABASE;
