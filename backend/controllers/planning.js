const planningMdsDB = require("../middleware/MySqlConnection");

//Add week total hours
exports.addWeekHours = (req, res, next) => {
  const hoursPerDay = req.body.data[0];
  const weekWorkTime = req.body.data[1];

  const querySelectWorkedHours = "SELECT user_id, week_number FROM worked_hours WHERE user_id=? AND week_number = ?";
  const queryInsertWorkedHours =
    "INSERT INTO worked_hours (user_id,week_number,monday_hours,tuesday_hours,wednesday_hours,thursday_hours,friday_hours,saturday_hours,sunday_hours,total_worked_hours,total_modulation_hours,total_additional_hours) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
  const queryUpdateWorkedHours =
    "UPDATE worked_hours SET user_id = ?,week_number=?,monday_hours=?,tuesday_hours=?,wednesday_hours=?,thursday_hours=?,friday_hours=?,saturday_hours=?,sunday_hours=?,total_worked_hours=?,total_modulation_hours=?,total_additional_hours=?  WHERE user_id=? AND week_number = ?";

  planningMdsDB.query(querySelectWorkedHours, [req.auth.userId, weekWorkTime.weekNumber], function (err, result, fields) {
    if (err != null) {
      res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line16");
    } else if (result[0] === undefined) {
      planningMdsDB.query(
        queryInsertWorkedHours,
        [
          req.auth.userId,
          weekWorkTime.weekNumber,
          hoursPerDay[0].worktime,
          hoursPerDay[1].worktime,
          hoursPerDay[2].worktime,
          hoursPerDay[3].worktime,
          hoursPerDay[4].worktime,
          hoursPerDay[5].worktime,
          hoursPerDay[6].worktime,
          weekWorkTime.totalHours,
          weekWorkTime.modulationHours,
          weekWorkTime.additionalHours,
        ],
        function (err, result, fields) {
          if (err != null) {
            res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line36");
          } else {
            res.status(200).json("données worked_hours ajouté");
          }
        }
      );
    } else if (result[0] !== undefined) {
      planningMdsDB.query(
        queryUpdateWorkedHours,
        [
          req.auth.userId,
          weekWorkTime.weekNumber,
          hoursPerDay[0].worktime,
          hoursPerDay[1].worktime,
          hoursPerDay[2].worktime,
          hoursPerDay[3].worktime,
          hoursPerDay[4].worktime,
          hoursPerDay[5].worktime,
          hoursPerDay[6].worktime,
          weekWorkTime.totalHours,
          weekWorkTime.modulationHours,
          weekWorkTime.additionalHours,
          req.auth.userId,
          weekWorkTime.weekNumber,
        ],
        function (err, result, fields) {
          if (err != null) {
            res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line62");
          } else {
            res.status(200).json("données worked_hours modifié");
          }
        }
      );
    }
  });
};

exports.addWeekPlanning = (req, res, next) => {
  const hoursPerDay = req.body.data[0];
  const weekWorkTime = req.body.data[1];
  const querySelectPlanning = "SELECT user_id, week_number FROM planning WHERE user_id=? AND week_number = ?";
  const queryInsertPlanning =
    "INSERT INTO planning (user_id,week_number,monday_start,monday_end,monday_pause,tuesday_start,tuesday_end,tuesday_pause,wednesday_start,wednesday_end,wednesday_pause,thursday_start,thursday_end,thursday_pause,friday_start,friday_end,friday_pause,saturday_start,saturday_end,saturday_pause,sunday_start,sunday_end,sunday_pause) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
  const queryUpdatePlanning =
    "UPDATE planning SET user_id=?,week_number=?,monday_start=?,monday_end=?,monday_pause=?,tuesday_start=?,tuesday_end=?,tuesday_pause=?,wednesday_start=?,wednesday_end=?,wednesday_pause=?,thursday_start=?,thursday_end=?,thursday_pause=?,friday_start=?,friday_end=?,friday_pause=?,saturday_start=?,saturday_end=?,saturday_pause=?,sunday_start=?,sunday_end=?,sunday_pause=? WHERE user_id=? AND week_number = ?";
  planningMdsDB.query(querySelectPlanning, [req.auth.userId, weekWorkTime.weekNumber], function (err, result, fields) {
    if (err != null) {
      res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line78");
    } else if (result[0] === undefined) {
      planningMdsDB.query(
        queryInsertPlanning,
        [
          req.auth.userId,
          weekWorkTime.weekNumber,
          hoursPerDay[0].start,
          hoursPerDay[0].end,
          hoursPerDay[0].pause,
          hoursPerDay[1].start,
          hoursPerDay[1].end,
          hoursPerDay[1].pause,
          hoursPerDay[2].start,
          hoursPerDay[2].end,
          hoursPerDay[2].pause,
          hoursPerDay[3].start,
          hoursPerDay[3].end,
          hoursPerDay[3].pause,
          hoursPerDay[4].start,
          hoursPerDay[4].end,
          hoursPerDay[4].pause,
          hoursPerDay[5].start,
          hoursPerDay[5].end,
          hoursPerDay[5].pause,
          hoursPerDay[6].start,
          hoursPerDay[6].end,
          hoursPerDay[6].pause,
        ],
        function (err, result, fields) {
          if (err != null) {
            res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line109");
          } else {
            res.status(200).json("données planning ajouté");
          }
        }
      );
    } else if (result[0] !== undefined) {
      planningMdsDB.query(
        queryUpdatePlanning,
        [
          req.auth.userId,
          weekWorkTime.weekNumber,
          hoursPerDay[0].start,
          hoursPerDay[0].end,
          hoursPerDay[0].pause,
          hoursPerDay[1].start,
          hoursPerDay[1].end,
          hoursPerDay[1].pause,
          hoursPerDay[2].start,
          hoursPerDay[2].end,
          hoursPerDay[2].pause,
          hoursPerDay[3].start,
          hoursPerDay[3].end,
          hoursPerDay[3].pause,
          hoursPerDay[4].start,
          hoursPerDay[4].end,
          hoursPerDay[4].pause,
          hoursPerDay[5].start,
          hoursPerDay[5].end,
          hoursPerDay[5].pause,
          hoursPerDay[6].start,
          hoursPerDay[6].end,
          hoursPerDay[6].pause,
          req.auth.userId,
          weekWorkTime.weekNumber,
        ],
        function (err, result, fields) {
          if (err != null) {
            res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line147");
          } else {
            res.status(200).json("données planning modifié");
          }
        }
      );
    }
  });
};
