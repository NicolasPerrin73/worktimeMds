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
router.post("/hours", auth, planningCtrl.addWeekHours);
router.post("/planning", auth, planningCtrl.addWeekPlanning);

module.exports = router;
