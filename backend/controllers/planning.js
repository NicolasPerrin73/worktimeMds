const planningMdsDB = require("../middleware/MySqlConnection");

//Add week
exports.addWeek = (req, res, next) => {
  const hoursPerDay = req.body.data[0];
  const weekWorkTime = req.body.data[1];

  const querySelect = "SELECT user_id, week_number FROM planning WHERE user_id=? AND week_number = ?";
  const queryInsert =
    "INSERT INTO planning (user_id,week_number,monday_hours,tuesday_hours,wednesday_hours,thursday_hours,friday_hours,saturday_hours,sunday_hours,total_worked_hours,total_modulation_hours,total_additional_hours) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)";
  const queryUpdate =
    "UPDATE planning SET user_id = ?,week_number=?,monday_hours=?,tuesday_hours=?,wednesday_hours=?,thursday_hours=?,friday_hours=?,saturday_hours=?,sunday_hours=?,total_worked_hours=?,total_modulation_hours=?,total_additional_hours=?  WHERE user_id=? AND week_number = ?";
  planningMdsDB.query(querySelect, [req.auth.userId, weekWorkTime.weekNumber], function (err, result, fields) {
    if (err != null) {
      res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line11");
    } else if (result[0] === undefined) {
      planningMdsDB.query(
        queryInsert,
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
            res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line35");
          } else {
            res.status(200).json("donnée ajouté");
          }
        }
      );
    } else if (result[0] !== undefined) {
      planningMdsDB.query(
        queryUpdate,
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
            res.status(200).json("donnée modifié");
          }
        }
      );
    }
  });
};
