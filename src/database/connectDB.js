// /src/database/connectDB.js
const Sequelize = require("sequelize");
const { DATABASE } = require("../config");

const sequelize = new Sequelize(
  DATABASE.NAME,
  DATABASE.USERNAME,
  DATABASE.PASSWORD,
  {
    host: DATABASE.LOCAL,
    port: DATABASE.PORT,
    dialect: DATABASE.DIALECT,
  }
);

const connectDB = async () => {
  try {
    await sequelize.authenticate();

    const mysqlUrl = `${sequelize.getDialect()}://${DATABASE.USERNAME}:****@${
      DATABASE.LOCAL
    }:${DATABASE.PORT}/${DATABASE.NAME}`;

    console.log(`MySQL Connected on URL :- ${mysqlUrl}`);
  } catch (error) {
    console.log(`MySQL Connection Failed :- ${error.message}`);
    process.exit(1);
  }
};

sequelize.sync();

module.exports = { connectDB, sequelize };
