// /src/database/model/student.model.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { DataTypes, Model } = require("sequelize");
const { sequelize } = require("../connectDB");
const { JWT_CONFIG } = require("../../config");

class Student extends Model {
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

Student.init(
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
      defaultValue: "student",
      validate: {
        isIn: [["student"]],
      },
    },
    refreshToken: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Student",
    hooks: {
      async beforeSave(student) {
        if (student.changed("password")) {
          student.password = await bcrypt.hash(student.password, 10);
        }
      },
      async beforeUpdate(student) {
        if (student.changed("password")) {
          student.password = await bcrypt.hash(student.password, 10);
        }
      },
    },
  }
);

module.exports = Student;
