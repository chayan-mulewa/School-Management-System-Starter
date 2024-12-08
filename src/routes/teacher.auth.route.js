// src/routes/teacher.auth.route.js
const express = require("express");
const { teacherAuthController } = require("../controllers");
const { authMiddleware } = require("../middlewares");

const router = express.Router();
const teacher = express.Router();

teacher.post("/register", teacherAuthController.register);
teacher.post("/login", teacherAuthController.login);
teacher.post("/logout", authMiddleware.protect, teacherAuthController.logout);
teacher.get("/refresh-token", teacherAuthController.refreshAccessToken);

router.use("/teacher", teacher);

module.exports = router;
