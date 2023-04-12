const mysql = require("mysql2");

//MySql connection

const planningMdsDB = mysql.createPool({
  host: "82.165.49.163",
  user: process.env.MY_SQL_USER,
  password: process.env.MY_SQL_PASSWORD,
  database: "planningMds",
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = planningMdsDB;
