const mysql = require("mysql2");
const dotenv = require("dotenv").config({ path: "../../API/.env" });

//MySql connection

const planningMdsDB = mysql.createPool({
  host: "82.165.49.163",
  user: process.env.WORKTIME__SQL_USER,
  password: process.env.WORKTIME__SQL_PASSWORD,
  database: "planningMds",
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 20,
  queueLimit: 0,
});

module.exports = planningMdsDB;
