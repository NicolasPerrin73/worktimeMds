import React, { useEffect, useState } from "react";
import moment from "moment";
import WeeklyConfirm from "./WeeklyConfirm";

const WeeklyHoursForm = ({ events, setEvents, dataSent, setDataSent }) => {
  const [weekNumber, setWeekNumber] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [hoursPerDay, setHoursPerDay] = useState([
    { day: "monday", start: "", end: "", pause: "", worktime: "" },
    { day: "tuesday", start: "", end: "", pause: "", worktime: "" },
    { day: "wednesday", start: "", end: "", pause: "", worktime: "" },
    { day: "thursday", start: "", end: "", pause: "", worktime: "" },
    { day: "friday", start: "", end: "", pause: "", worktime: "" },
    { day: "saturday", start: "", end: "", pause: "", worktime: "" },
    { day: "sunday", start: "", end: "", pause: "", worktime: "" },
  ]);
  const [weekWorkTime, setWeekWorkTime] = useState({
    weekNumber: weekNumber,
    totalHours: 0,
    modulationHours: 0,
    additionalHours: 0,
  });
  const [submitClick, setSubmitClick] = useState(false);

  useEffect(() => {}, [hoursPerDay, daysOfWeek, weekNumber]);

  useEffect(() => {
    if (daysOfWeek.length !== 0) {
      for (let i = 0; i < hoursPerDay.length; i++) {
        hoursPerDay[i] = { ...hoursPerDay[i], day: daysOfWeek[i].date };
      }
    }
    const eventsArray = hoursPerDay
      .filter(({ start, end }) => start !== "" && end !== "") // Filter out items with empty start and end
      .map(({ day, start, end, worktime, pause }) => ({
        title: `travail ${worktime}h, dont ${pause}h de pause`,
        start: `${day}T${start}:00`,
        end: `${day}T${end}:00`,
      }));

    setEvents(eventsArray);
  }, [weekNumber, daysOfWeek, hoursPerDay]);

  const getDaysOfWeek = (weekNumber) => {
    const today = new Date();
    const year = today.getFullYear();
    // Trouver le premier jour de l'année qui commence par un lundi
    let startDate = new Date(year, 0, 1);
    while (startDate.getDay() !== 1) {
      startDate.setDate(startDate.getDate() + 1);
    }
    // Ajouter le nombre de semaines au début de l'année pour trouver la semaine demandée
    startDate.setDate(startDate.getDate() + 7 * (weekNumber - 1));
    // Créer un tableau des jours de la semaine demandée

    const daysOfWeek = [
      { date: "", dateFr: "" },
      { date: "", dateFr: "" },
      { date: "", dateFr: "" },
      { date: "", dateFr: "" },
      { date: "", dateFr: "" },
      { date: "", dateFr: "" },
      { date: "", dateFr: "" },
    ];
    for (let i = 0; i < 7; i++) {
      let day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dateFr = day.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      const date = moment(day).format("YYYY-MM-DD"); // Conversion de la date en format "YYYY-MM-DD"
      daysOfWeek[i] = { ...daysOfWeek[i], date: date, dateFr: dateFr };
    }
    setDaysOfWeek(daysOfWeek);
  };

  const handleWeekChange = (e) => {
    setWeekNumber(e.target.value);
    getDaysOfWeek(e.target.value);
    setWeekWorkTime({ ...weekWorkTime, weekNumber: e.target.value });
  };

  const handleStartHour = (day, index, value) => {
    let hoursPerDayNewArray = hoursPerDay.slice();
    hoursPerDayNewArray[index] = { ...hoursPerDayNewArray[index], day: day, start: value };
    setHoursPerDay(hoursPerDayNewArray);
  };

  const handleEndHour = (day, index, value) => {
    let hoursPerDayNewArray = hoursPerDay.slice();
    hoursPerDayNewArray[index] = { ...hoursPerDayNewArray[index], day: day, end: value };
    setHoursPerDay(hoursPerDayNewArray);
  };

  const handleBreakHour = (day, index, value) => {
    let hoursPerDayNewArray = hoursPerDay.slice();
    hoursPerDayNewArray[index] = { ...hoursPerDayNewArray[index], day: day, pause: value };
    setHoursPerDay(hoursPerDayNewArray);
  };

  const workTimeCalcul = (i) => {
    if (daysOfWeek[i] === "" || hoursPerDay[i].start === "" || hoursPerDay[i].end === "" || hoursPerDay[i].pause === "") {
      return 0;
    } else if (daysOfWeek[i] !== "" && hoursPerDay[i].start !== "" && hoursPerDay[i].end !== "" && hoursPerDay[i].pause !== "") {
      // Date de début
      const startDate = new Date(`${daysOfWeek[i].date}T${hoursPerDay[i].start}:00`);
      // Date de fin
      const endDate = new Date(`${daysOfWeek[i].date}T${hoursPerDay[i].end}:00`);
      // Temps de pause
      const [hours, minutes] = hoursPerDay[i].pause.split(":");
      const breakInMs = (+hours * 60 + +minutes) * 60 * 1000;

      // Calcul du nombre de millisecondes entre les deux dates
      const diffInMs = endDate - startDate - breakInMs;
      // Calcul du nombre d'heures arrondi à 2 décimales
      let wortimeResult = Math.round((diffInMs / (1000 * 60 * 60)) * 100) / 100;

      if (wortimeResult < 0) {
        wortimeResult = "Erreur";
      }

      return wortimeResult;
    }
  };

  const weeklyWorkingHours = (totalHours) => {
    if (totalHours <= 35) {
      setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, modulationHours: totalHours - 35, additionalHours: 0 });
    } else if (totalHours <= 42) {
      setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, modulationHours: totalHours - 35, additionalHours: 0 });
    } else {
      return setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, modulationHours: 7, additionalHours: totalHours - 42 });
    }
  };

  const handleCalcHour = (e) => {
    e.preventDefault();
    let hoursPerDayNewArray = hoursPerDay.slice();
    for (let i = 0; i < hoursPerDay.length; i++) {
      let worktime = workTimeCalcul(i);
      hoursPerDayNewArray[i] = { ...hoursPerDayNewArray[i], worktime: worktime };
      setHoursPerDay(hoursPerDayNewArray);
    }
    let wortimeArray = [];
    let totalHours = 0;
    for (let i = 0; i < hoursPerDayNewArray.length; i++) {
      if (hoursPerDayNewArray[i].worktime === "Erreur") {
        alert("Erreur de saisie, calcul impossible");
      } else {
        wortimeArray.push(hoursPerDayNewArray[i].worktime);
        totalHours = wortimeArray.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        });
        setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours });
      }
    }
    weeklyWorkingHours(totalHours);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    let hoursPerDayNewArray = hoursPerDay.slice();
    for (let i = 0; i < hoursPerDay.length; i++) {
      let worktime = workTimeCalcul(i);
      hoursPerDayNewArray[i] = { ...hoursPerDayNewArray[i], worktime: worktime };
      setHoursPerDay(hoursPerDayNewArray);
    }
    let wortimeArray = [];
    let totalHours = 0;
    for (let i = 0; i < hoursPerDayNewArray.length; i++) {
      if (hoursPerDayNewArray[i].worktime === "Erreur") {
        alert("Erreur de saisie, calcul impossible");
      } else {
        wortimeArray.push(hoursPerDayNewArray[i].worktime);
        totalHours = wortimeArray.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        });
        setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours });
      }
    }
    weeklyWorkingHours(totalHours);
    setSubmitClick(true);
    // envoyer les données à l'API ici
  };

  return (
    <>
      <h1>Saisie de planification:</h1>
      <form onSubmit={handleSubmit} className="weekForm">
        {submitClick ? (
          ""
        ) : (
          <div>
            <label htmlFor="week" className="weekForm__label weekForm__label--week">
              <span>Semaine n°:</span>
              <input type="number" id="week" value={weekNumber} onChange={handleWeekChange} />
            </label>

            {daysOfWeek.map((dayFr, index) => (
              <ul key={index}>
                <li>{daysOfWeek[index].dateFr}</li>
                <div className="weekForm__days">
                  <li>
                    <label htmlFor="start-time" className="weekForm__label">
                      Prise de poste:
                      <input type="time" id="start-time" name="start-time" value={hoursPerDay[index].start} onChange={(e) => handleStartHour(daysOfWeek[index].date, index, e.target.value)} />
                    </label>
                  </li>
                  <li>
                    <label htmlFor="end-time" className="weekForm__label">
                      Fin de poste:
                      <input type="time" id="end-time" name="end-time" value={hoursPerDay[index].end} onChange={(e) => handleEndHour(daysOfWeek[index].date, index, e.target.value)} />
                    </label>
                  </li>

                  <li>
                    <label htmlFor="pause-time" className="weekForm__label">
                      Temps de pause:
                      <input type="time" id="pause-time" name="pause-time" value={hoursPerDay[index].pause} onChange={(e) => handleBreakHour(daysOfWeek[index].date, index, e.target.value)} />
                    </label>
                  </li>
                </div>
                {hoursPerDay[index].worktime === "Erreur" ? <p>Erreur</p> : <p>Nombre d'heures travailler: {hoursPerDay[index].worktime}</p>}
              </ul>
            ))}

            <div className="totalHours">
              <p>Nombre d'heure de la semaine: {weekWorkTime.totalHours}</p>
              <p>Module: {weekWorkTime.modulationHours}</p>
              <p>heure supp: {weekWorkTime.additionalHours}</p>
            </div>

            <div className="buttons">
              <button onClick={handleCalcHour}>Calcul</button>

              <button onClick={handleSubmit}>Envoyer</button>
            </div>
          </div>
        )}

        {submitClick ? (
          <WeeklyConfirm
            daysOfWeek={daysOfWeek}
            hoursPerDay={hoursPerDay}
            weekWorkTime={weekWorkTime}
            submitClick={submitClick}
            setSubmitClick={setSubmitClick}
            events={events}
            dataSent={dataSent}
            setDataSent={setDataSent}
          />
        ) : (
          ""
        )}
      </form>
    </>
  );
};

export default WeeklyHoursForm;
