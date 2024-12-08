// src/middleware/auth.middleware.js
const jwt = require("jsonwebtoken");
const { JWT_CONFIG } = require("../config");
const { User } = require("../database/models");
const { AppError } = require("../errors");
const { asyncHandler } = require("../utils");

const protect = asyncHandler(async (req, _, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new AppError("Unauthorized Request", 401);
  }

  try {
    const decodedToken = await jwt.verify(
      token,
      JWT_CONFIG.ACCESS_TOKEN_SECRET
    );

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken"
    );

    if (!user) {
      throw new AppError("Invalid Access Token", 401);
    }

    req.user = user;
    next();
  } catch (error) {
    throw new AppError(error?.message || "Invalid Access Token", 401);
  }
});

const restrict = (roles) => {
  return asyncHandler(async (req, res, next) => {
    if (!req.user) {
      throw new AppError("Unauthorized Request", 401);
    }
    if (!roles.includes(req.user.role)) {
      throw new AppError(
        "Forbidden : You do not have permission to access this resource",
        403
      );
    }
    next();
  });
};

module.exports = { protect, restrict };
