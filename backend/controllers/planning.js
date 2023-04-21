const planningMdsDB = require("../middleware/MySqlConnection");

//Add week total hours
exports.addWeekHours = (req, res, next) => {
  const hoursPerDay = req.body.data[0];
  const weekWorkTime = req.body.data[1];

  const querySelectWorkedHours = "SELECT user_id, week_number FROM worked_hours WHERE user_id=? AND week_number = ?";
  const queryInsertWorkedHours = "INSERT INTO worked_hours (user_id,week_number,total_worked_hours,total_modulation_hours,total_additional_hours) VALUES (?,?,?,?,?)";
  const queryUpdateWorkedHours = "UPDATE worked_hours SET user_id = ?,week_number=?,total_worked_hours=?,total_modulation_hours=?,total_additional_hours=?  WHERE user_id=? AND week_number = ?";

  planningMdsDB.query(querySelectWorkedHours, [req.auth.userId, weekWorkTime.weekNumber], function (err, result, fields) {
    if (err != null) {
      res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line14");
    } else if (result[0] === undefined) {
      planningMdsDB.query(
        queryInsertWorkedHours,
        [req.auth.userId, weekWorkTime.weekNumber, weekWorkTime.totalHours, weekWorkTime.modulationHours, weekWorkTime.additionalHours],
        function (err, result, fields) {
          if (err != null) {
            res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line21");
          } else {
            res.status(200).json("données worked_hours ajouté");
          }
        }
      );
    } else if (result[0] !== undefined) {
      planningMdsDB.query(
        queryUpdateWorkedHours,
        [req.auth.userId, weekWorkTime.weekNumber, weekWorkTime.totalHours, weekWorkTime.modulationHours, weekWorkTime.additionalHours, req.auth.userId, weekWorkTime.weekNumber],
        function (err, result, fields) {
          if (err != null) {
            res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line33");
          } else {
            res.status(200).json("données worked_hours modifié");
          }
        }
      );
    }
  });
};

exports.getWorkedHours = (req, res, next) => {
  const querySelect = "SELECT * FROM worked_hours WHERE user_id=?";
  planningMdsDB.query(querySelect, [req.auth.userId], function (err, result, fields) {
    if (err != null) {
      res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line122");
    } else {
      res.status(200).json(result);
    }
  });
};

exports.addWeekPlanning = async (req, res, next) => {
  const hoursPerDay = req.body.data[0];
  const weekWorkTime = req.body.data[1];
  const events = req.body.data[2];
  const querySelectPlanning = "SELECT * FROM planning WHERE user_id=? AND week_number = ?";
  const queryInsertPlanning = "INSERT INTO planning (user_id, title, start, end, day, worked_hours, week_number) VALUES (?,?,?,?,?,?,?)";
  const queryUpdatePlanning = "UPDATE planning SET user_id=?,title = ?, start=?, end=?, day=?, worked_hours=?, week_number=? WHERE user_id=? AND day=?";
  const queryDeletePlanning = "DELETE FROM planning WHERE week_number=? AND user_id=?";

  let promises = [];

  planningMdsDB.query(querySelectPlanning, [req.auth.userId, weekWorkTime.weekNumber], function (err, result, fields) {
    if (err != undefined) {
      res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line56");
    } else if (result.length >= 1) {
      planningMdsDB.query(queryDeletePlanning, [weekWorkTime.weekNumber, req.auth.userId], function (err, result, fields) {
        if (err != null) {
          res.status(500).json("addWeekPlanning error:" + err.message + "at file ../controllers/file:line60");
        } else {
          events.forEach((event, index) => {
            const promise = new Promise((resolve, reject) => {
              planningMdsDB.query(
                queryInsertPlanning,
                [req.auth.userId, events[index].title, events[index].start, events[index].end, events[index].day, events[index].workedHours, events[index].weekNumber],
                function (err, result, fields) {
                  if (err != null) {
                    reject(err);
                  } else {
                    resolve(result);
                  }
                }
              );
            });
            promises.push(promise);
          });
        }
      });
    } else if (result.length == 0) {
      events.forEach((event, index) => {
        const promise = new Promise((resolve, reject) => {
          planningMdsDB.query(
            queryInsertPlanning,
            [req.auth.userId, events[index].title, events[index].start, events[index].end, events[index].day, events[index].workedHours, events[index].weekNumber],
            function (err, result, fields) {
              if (err != null) {
                reject(err);
              } else {
                resolve(result);
              }
            }
          );
        });
        promises.push(promise);
      });
    }
  });
  try {
    const result = await Promise.all(promises);
    res.status(200).json("Données planning ajoutées");
  } catch (err) {
    res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line103");
  }
};

exports.getPlanning = (req, res, next) => {
  const querySelect = "SELECT title, start, end FROM planning WHERE user_id=?";
  planningMdsDB.query(querySelect, [req.auth.userId], function (err, result, fields) {
    if (err != null) {
      res.status(500).json("addWeek error:" + err.message + "at file ../controllers/planning.js:line111");
    } else {
      res.status(200).json(result);
    }
  });
};
