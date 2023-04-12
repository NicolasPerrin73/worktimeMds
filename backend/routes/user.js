//Module
const express = require("express");

//Router function
const router = express.Router();

//Controllers
const userCtrl = require("../controllers/user");

//Middleware
const auth = require("../middleware/authorize");
const multer = require("../middleware/multerConfig");

//Endpoints
router.post("/signup", userCtrl.signup);
router.post("/login", userCtrl.login);
router.get("/user", auth, userCtrl.getUserData);

module.exports = router;
