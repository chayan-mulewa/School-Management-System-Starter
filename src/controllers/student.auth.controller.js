// src/controllers/student.auth.controller.js
const { AppResponse } = require("../responses");
const { studentAuthService } = require("../services");
const { asyncHandler, responseOptions } = require("../utils");

const register = asyncHandler(async (req, res, next) => {
  const newUser = await studentAuthService.register(req);

  const response = new AppResponse(201, "User Successfully Created", newUser);

  return res.status(response.statusCode).json({ response });
});

const login = asyncHandler(async (req, res, next) => {
  const data = await studentAuthService.login(req);

  const response = new AppResponse(200, "User Successfully Logged In", data);

  return res
    .status(response.statusCode)
    .cookie("accessToken", data.accessToken, responseOptions)
    .cookie("refreshToken", data.refreshToken, responseOptions)
    .cookie("role", data.role, responseOptions)
    .json({ response });
});

const logout = asyncHandler(async (req, res, next) => {
  await studentAuthService.logout(req);

  const response = new AppResponse(200, "User Successfully Logged Out");

  return res
    .status(response.statusCode)
    .clearCookie("accessToken", responseOptions)
    .clearCookie("refreshToken", responseOptions)
    .json({ response });
});

const refreshAccessToken = asyncHandler(async (req, res, next) => {
  const data = await studentAuthService.refreshAccessToken(req);

  const response = new AppResponse(200, "Access Token Refreshed", data);

  return res
    .status(response.statusCode)
    .cookie("accessToken", data.accessToken, responseOptions)
    .cookie("refreshToken", data.refreshToken, responseOptions)
    .json({ response });
});

module.exports = { register, login, logout, refreshAccessToken };
