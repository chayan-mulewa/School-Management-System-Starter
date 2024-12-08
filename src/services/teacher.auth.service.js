// src/services/teacher.auth.service.js
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const { JWT_CONFIG } = require("../config");
const { Teacher } = require("../database/models");
const { FieldError, AppError } = require("../errors");

const generateAccessAndRefereshTokens = async (teacherId) => {
  try {
    const teacher = await Teacher.findByPk(teacherId);
    if (!teacher) {
      throw new AppError("Teacher not found", 404);
    }
    const accessToken = teacher.generateAccessToken();
    const refreshToken = teacher.generateRefreshToken();

    teacher.refreshToken = refreshToken;
    await teacher.save({ validate: false });

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

  const existingEmail = await Teacher.findOne({ where: { email } });
  if (existingEmail) {
    throw new FieldError("email", "Email is already taken", 403);
  }

  const existingTeachername = await Teacher.findOne({ where: { username } });
  if (existingTeachername) {
    throw new FieldError("username", "Teachername is already taken", 403);
  }

  const newTeacher = await Teacher.create({
    firstName,
    lastName,
    username,
    email,
    password,
    role,
  });

  const createdTeacher = await Teacher.findByPk(newTeacher.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  if (!createdTeacher) {
    throw new AppError(
      500,
      "Something went wrong while fetching the created Teacher"
    );
  }

  return createdTeacher;
};

const login = async (req) => {
  const { email, password } = req.body;

  const teacher = await Teacher.findOne({ where: { email } });
  if (!teacher) {
    throw new FieldError("email", "Email does not exist", 403);
  }

  const passwordMatch = await bcrypt.compare(password, teacher.password);
  if (!passwordMatch) {
    throw new FieldError("password", "Password is invalid", 403);
  }

  const { accessToken, refreshToken } = await generateAccessAndRefereshTokens(
    teacher.id
  );

  const loggedInTeacher = await Teacher.findByPk(teacher.id, {
    attributes: { exclude: ["password", "refreshToken"] },
  });

  const data = {
    teacher: loggedInTeacher,
    accessToken,
    refreshToken,
  };

  return data;
};

const logout = async (req) => {
  await Teacher.findByIdAndUpdate(
    req.Teacher._id,
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

    const Teacher = await Teacher.findByPk(decodedToken?.id);

    if (!Teacher) {
      throw new FieldError("refreshToken", "Invalid Refresh Token", 401);
    }

    if (incomingRefreshToken !== Teacher?.refreshToken) {
      throw new FieldError(
        "refreshToken",
        "Refresh Token is Expired or Used",
        401
      );
    }

    const { accessToken, newRefreshToken } =
      await generateAccessAndRefereshTokens(Teacher._id);

    const data = { accessToken, refreshToken: newRefreshToken };

    return data;
  } catch (error) {
    throw new FieldError("refreshToken", "Invalid refresh token", 401);
  }
};

module.exports = { register, login, logout, refreshAccessToken };
