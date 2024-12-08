// src/routes/student.auth.route.js
const express = require("express");
const { studentAuthController } = require("../controllers");
const { authMiddleware } = require("../middlewares");

const router = express.Router();
const student = express.Router();

student.post("/register", studentAuthController.register);
student.post("/login", studentAuthController.login);
student.post("/logout", authMiddleware.protect, studentAuthController.logout);
student.get("/refresh-token", studentAuthController.refreshAccessToken);

router.use("/student", student);

module.exports = router;
