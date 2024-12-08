// src/services/student.auth.service.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_CONFIG } = require("../config");
const { Student } = require("../database/models");
const { FieldError, AppError } = require("../errors");

const generateAccessAndRefereshTokens = async (studentId) => {
  try {
    const student = await Student.findByPk(studentId);
    if (!student) {
      throw new AppError("Student not found", 404);
    }
    const accessToken = student.generateAccessToken();
    const refreshToken = student.generateRefreshToken();

    student.refreshToken = refreshToken;
    await student.save({ validate: false });

    return { accessToken, refreshToken };
  } catch (error) {
    console.log(error);
    throw new AppError(
      "Something went wrong while generating refresh and access token",
      500
    );
  }
};

const register = async (req) => {
  const { firstName, lastName, username, email, password, role } = req.body;

  const existingEmail = await Student.findOne({ where: { email } });
  if (existingEmail) {
    throw new FieldError("email", "Email is already taken", 403);
  }

  const existingUsername = await Student.findOne({ where: { username } });
  if (existingUsername) {
    throw new FieldError("username", "Username is already taken", 403);
  }

  const newStudent = await Student.create({
    firstName,
    lastName,
    username,
    email,
    password,
    role,
  });

  const createdStudent = await Student.findByPk(newStudent.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!createdStudent) {
    throw new AppError(
      500,
      "Something went wrong while fetching the created Student"
    );
  }

  return createdStudent;
};

const login = async (req) => {
  const { email, password } = req.body;

  const student = await Student.findOne({ where: { email } });
  if (!student) {
    throw new FieldError("email", "Email does not exist", 403);
  }

  const passwordMatch = await bcrypt.compare(password, student.password);
  if (!passwordMatch) {
    throw new FieldError("password", "Password is invalid", 403);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    student.id
  );

  const loggedInStudent = await Student.findByPk(student.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  const data = {
    student: loggedInStudent,
    accessToken,
    refreshToken,
  };

  return data;
};

const logout = async (req) => {
  await Student.findByIdAndUpdate(
    req.Student._id,
    {
      $unset: {
        refreshToken: 1,
      },
    },
    {
      new: true,
    }
  );
};

const refreshAccessToken = async (req) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new FieldError("refreshToken", "Unauthorized Request", 401);
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      JWT_CONFIG.REFRESH_TOKEN_SECRET
    );

    const Student = await Student.findByPk(decodedToken?.id);

    if (!Student) {
      throw new FieldError("refreshToken", "Invalid Refresh Token", 401);
    }

    if (incomingRefreshToken !== Student?.refreshToken) {
      throw new FieldError(
        "refreshToken",
        "Refresh Token is Expired or Used",
        401
      );
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(Student._id);

    const data = { accessToken, refreshToken: newRefreshToken };

    return data;
  } catch (error) {
    throw new FieldError("refreshToken", "Invalid refresh token", 401);
  }
};

module.exports = { register, login, logout, refreshAccessToken };
