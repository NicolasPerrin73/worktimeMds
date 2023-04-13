//Module
const express = require("express");

//Router
const router = express.Router();

//Middleware
const auth = require("../middleware/authorize");
const planningMdsDB = require("../middleware/MySqlConnection");

//Controllers
const planningCtrl = require("../controllers/planning");

//Endpoints for post
router.post("/", auth, planningCtrl.addWeek);

module.exports = router;
