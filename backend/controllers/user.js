//Module
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const planningMdsDB = require("../middleware/MySqlConnection");
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
        const insertQuery = "INSERT INTO `user`(`email`, `password`,`first_name`,`last_name`) VALUES (?,?,?,?)";
        planningMdsDB.query(insertQuery, [req.body.email, hashPassword, req.body.firstName, req.body.lastName], function (err, results, fields) {
          //Find user id created to login
          if (results != undefined) {
            const selectQuery = "SELECT id FROM user WHERE email = ?";
            planningMdsDB.query(selectQuery, [req.body.email], function (err, results, fields) {
              if (err != null) {
                res.status(500).json("signup error : " + err.message + " at file ../controllers/user.js:line26");
                //send userId and token
              } else {
                const token = jwt.sign({ userId: results[0].id }, process.env.TOKEN_KEY, { expiresIn: "7d" });
                res.status(200).json({
                  userId: results[0].id,
                  token: token,
                });
              }
            });
          } else {
            console.log(err);
            return res.status(400).json("signup error: " + err.message + " at file ../controllers/user.js:line37");
          }
        });
      })
      .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line41"));
  }
};

//Login
exports.login = (req, res, next) => {
  //Find user in database by email
  const query = "SELECT id,password FROM user WHERE email = ?";
  planningMdsDB.query(query, [req.body.email], function (err, results, fields) {
    if (err != null) {
      res.status(500).json("login error : " + err.message + " at file ../controllers/user.js:line51");
      //User not find
    } else if (results[0] == undefined) {
      res.status(401).json("login error: Invalid user or password");
      console.log("utilisateur introuvable");
      //User finded
    } else {
      bcrypt
        .compare(req.body.password, results[0].password)
        .then((valid) => {
          //Password incorrect
          if (!valid) {
            res.status(401).json("login error: Invalid user or password");
            console.log("mot de passe invalide");
            //Password correct
          } else {
            const token = jwt.sign({ userId: results[0].id }, process.env.TOKEN_KEY, { expiresIn: "7d" });
            res.status(200).json({
              userId: results[0].id,
              token: token,
            });
          }
        })
        .catch((error) => res.status(500).json("bcrypt error: " + error + " at file ../controllers/user.js:line72"));
    }
  });
};

//Get user data from request
exports.getUserData = (req, res, next) => {
  const query = "SELECT `id`,`last_name`,`first_name` FROM user WHERE id = ?";
  planningMdsDB.query(query, [req.auth.userId], function (err, userData, fields) {
    if (err != null) {
      res.status(500).json("getUserData error: " + err.message + " at file ../controllers/user.js:line95");
    } else if (userData.length == 0) {
      res.status(404).json("getUserData error: User not found at file ../controllers/user.js:line97");
    } else {
      res.status(200).json(userData);
    }
  });
};
