//Module
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config({ path: "../../API/.env" });

//Token verification
module.exports = (req, res, next) => {
  try {
    const token = req.headers.authorization.split(" ")[1];
    const decodedToken = jwt.verify(token, process.env.WORKTIME__KEY);
    const userId = decodedToken.userId;
    req.auth = {
      userId: userId,
    };
    next();
  } catch (error) {
    res.status(401).json("Unauthorized request : " + error);
  }
};
