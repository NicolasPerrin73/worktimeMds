//Module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const groupomaniaDB = require("../middleware/MySqlConnection");
const fs = require("fs");

// Sign up
exports.signup = (req, res, next) => {
  //Check empty input sent
  if (req.body.email == "" || req.body.password == "" || req.body.lastName == "" || req.body.firstName == "") {
    res.status(400).json("Error : can't send empty values to database at file ../controllers/user.js:line12");
    // Hash password and add all input to database
  } else {
    bcrypt
      .hash(req.body.password, 10)
      .then((hash) => {
        const hashPassword = hash;
        const insertQuery = "INSERT INTO `user`(`email`, `password`,`nom`,`prenom`) VALUES (?,?,?,?)";
        groupomaniaDB.query(insertQuery, [req.body.email, hashPassword, req.body.firstName, req.body.lastName], function (err, results, fields) {
          //Find user id created to login
          if (results != undefined) {
            const selectQuery = "SELECT id FROM user WHERE email = ?";
            groupomaniaDB.query(selectQuery, [req.body.email], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("signup error : " + err.message + " at file ../controllers/user.js:line26");
                //Add signed token to database, send userId and token
              } else {
                const token = jwt.sign({ userId: results[0].id }, process.env.TOKEN_KEY, { expiresIn: "7d" });
                const updateQuery = "UPDATE user SET token = ? WHERE email = ?";
                groupomaniaDB.query(updateQuery, [token, req.body.email], function (err, results, fields) {
                  if (err != null) {
                    res.status(500).json("signup error : " + err.message + " at file ../controllers/user.js:line33");
                  }
                });
                res.status(200).json({
                  userId: results[0].id,
                  token: token,
                });
              }
            });
          } else {
            console.log(err);
            return res.status(400).json("signup error: " + err.message + " at file ../controllers/user.js:line44");
          }
        });
      })
      .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line48"));
  }
};

//Login
exports.login = (req, res, next) => {
  //Find user in database by email
  const query = "SELECT id,password FROM user WHERE email = ?";
  groupomaniaDB.query(query, [req.body.email], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("login error : " + err.message + " at file ../controllers/user.js:line58");
      //User not find
    } else if (results[0] == undefined) {
      res.status(401).json("login error: Invalid user or password");
      //User finded
    } else {
      bcrypt
        .compare(req.body.password, results[0].password)
        .then((valid) => {
          //Password incorrect
          if (!valid) {
            res.status(401).json("login error: Invalid user or password");
            //Password correct
          } else {
            const token = jwt.sign({ userId: results[0].id }, process.env.TOKEN_KEY, { expiresIn: "7d" });
            const query = "UPDATE user SET token = ? WHERE email = ?";
            groupomaniaDB.query(query, [token, req.body.email], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("login error : " + err.message + " at file ../controllers/user.js:line76");
              }
            });
            res.status(200).json({
              userId: results[0].id,
              token: token,
            });
          }
        })
        .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line85"));
    }
  });
};
