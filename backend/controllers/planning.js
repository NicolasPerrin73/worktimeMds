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

exports.addWeekPlanning = async (req, res, next) => {
  const hoursPerDay = req.body.data[0];
  const weekWorkTime = req.body.data[1];
  const events = req.body.data[2];

  const querySelectPlanning = "SELECT user_id, day FROM planning WHERE user_id=? AND day = ?";
  const queryInsertPlanning = "INSERT INTO planning (user_id, title, start, end, day) VALUES (?,?,?,?,?)";
  const queryUpdatePlanning = "UPDATE planning SET user_id=?,title = ?, start=?, end=?, day=? WHERE user_id=? AND day = ?";
  let promises = [];
  events.forEach((event, index) => {
    const promise = new Promise((resolve, reject) => {
      planningMdsDB.query(querySelectPlanning, [req.auth.userId, hoursPerDay[index].day], function (err, result, fields) {
        if (err != null) {
          reject(err);
        } else if (result[0] === undefined) {
          console.log(result[0]);
          planningMdsDB.query(queryInsertPlanning, [req.auth.userId, events[index].title, events[index].start, events[index].end, hoursPerDay[index].day], function (err, result, fields) {
            if (err != null) {
              reject(err);
            } else {
              resolve(result);
            }
          });
        } else if (result[0] !== undefined) {
          console.log(result[0]);
          planningMdsDB.query(
            queryUpdatePlanning,
            [req.auth.userId, events[index].title, events[index].start, events[index].end, hoursPerDay[index].day, req.auth.userId, hoursPerDay[index].day],
            function (err, result, fields) {
              if (err != null) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        }
      });
    });
    promises.push(promise);
  });

  try {
    const result = await Promise.all(promises);
    res.status(200).json("Données planning ajoutées ou modifiées");
  } catch (err) {
    res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line119");
  }
};

exports.getPlanning = (req, res, next) => {
  const querySelect = "SELECT title, start, end FROM planning WHERE user_id=?";
  planningMdsDB.query(querySelect, [req.auth.userId], function (err, result, fields) {
    if (err != null) {
      res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line127");
    } else {
      res.status(200).json(result);
    }
  });
};
