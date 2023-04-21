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
router.get("/hours", auth, planningCtrl.getWorkedHours);
router.post("/planning", auth, planningCtrl.addWeekPlanning);
router.get("/planning", auth, planningCtrl.getPlanning);

module.exports = router;
