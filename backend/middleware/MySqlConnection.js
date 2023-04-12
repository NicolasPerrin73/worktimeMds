const mysql = require("mysql2");

//MySql connection

const groupomaniaDB = mysql.createPool({
  host: "localhost",
  user: process.env.MY_SQL_USER,
  password: process.env.MY_SQL_PASSWORD,
  database: "groupomania",
  multipleStatements: true,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

module.exports = groupomaniaDB;
