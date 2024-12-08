// /src/database/model/teacher.model.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../connectDB");
const { JWT_CONFIG } = require("../../config");

class Teacher extends Model {
  async isPasswordCorrect(password) {
    return await bcrypt.compare(password, this.password);
  }
  generateAccessToken() {
    return jwt.sign(
      {
        id: this.id,
        role: this.role,
      },
      JWT_CONFIG.ACCESS_TOKEN_SECRET,
      { expiresIn: JWT_CONFIG.ACCESS_TOKEN_EXPIRY }
    );
  }
  generateRefreshToken() {
    return jwt.sign(
      {
        id: this.id,
        role: this.role,
      },
      JWT_CONFIG.REFRESH_TOKEN_SECRET,
      { expiresIn: JWT_CONFIG.REFRESH_TOKEN_EXPIRY }
    );
  }
}

Teacher.init(
  {
    avatar: {
      type: DataTypes.STRING,
      allowNull: true,
      trim: true,
      defaultValue: "",
    },
    firstName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    lastName: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      trim: true,
      validate: {
        isEmail: true,
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      trim: true,
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      defaultValue: "teacher",
      validate: {
        isIn: [["teacher"]],
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Teacher",
    hooks: {
      async beforeSave(teacher) {
        if (teacher.changed("password")) {
          teacher.password = await bcrypt.hash(teacher.password, 10);
        }
      },
      async beforeUpdate(teacher) {
        if (teacher.changed("password")) {
          teacher.password = await bcrypt.hash(teacher.password, 10);
        }
      },
    },
  }
);

module.exports = Teacher;
