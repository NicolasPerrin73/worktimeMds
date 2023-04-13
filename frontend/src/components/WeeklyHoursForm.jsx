import React, { useEffect, useState } from "react";
import moment from "moment";
import WeeklyConfirm from "./WeeklyConfirm";

const WeeklyHoursForm = () => {
  const [weekNumber, setWeekNumber] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [daysOfWeekFr, setDaysOfWeekFr] = useState([]);
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
    const daysOfWeekFr = [];
    const daysOfWeek = [];
    for (let i = 0; i < 7; i++) {
      let day = new Date(startDate);
      day.setDate(startDate.getDate() + i);
      const dateFr = day.toLocaleDateString("fr-FR", { weekday: "long", year: "numeric", month: "long", day: "numeric" });
      daysOfWeekFr.push(dateFr);
      const date = moment(day).format("YYYY-MM-DD"); // Conversion de la date en format "YYYY-MM-DD"
      daysOfWeek.push(date);
    }
    setDaysOfWeekFr(daysOfWeekFr);
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
    if (daysOfWeek[i] === "" || hoursPerDay[i].start === "" || hoursPerDay[i].end === "") {
      return 0;
    } else if (daysOfWeek[i] !== "" && hoursPerDay[i].start !== "" && hoursPerDay[i].end !== "") {
      // Date de début
      const startDate = new Date(`${daysOfWeek[i]}T${hoursPerDay[i].start}:00`);
      // Date de fin
      const endDate = new Date(`${daysOfWeek[i]}T${hoursPerDay[i].end}:00`);
      // Calcul du nombre de millisecondes entre les deux dates
      const diffInMs = endDate - startDate;
      // Calcul du nombre d'heures arrondi à 2 décimales
      const diffInHours = Math.round((diffInMs / (1000 * 60 * 60)) * 100) / 100;
      let wortimeResult = diffInHours - Number(hoursPerDay[i].pause);
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
    <form onSubmit={handleSubmit}>
      <label>
        Semaine n°:
        <input type="number" value={weekNumber} onChange={handleWeekChange} />
      </label>

      {daysOfWeekFr.map((day, index) => (
        <div key={day}>
          <p>{day}</p>
          <label>
            Prise de poste:
            <input type="time" id="start-time" name="start-time" value={hoursPerDay[index].start} onChange={(e) => handleStartHour(day, index, e.target.value)} />
          </label>
          <label>
            Fin de poste:
            <input type="time" id="end-time" name="end-time" value={hoursPerDay[index].end} onChange={(e) => handleEndHour(day, index, e.target.value)} />
          </label>

          <label>
            Heure de pause:
            <select onChange={(e) => handleBreakHour(day, index, e.target.value)}>
              <option value="">Temps de pause</option>
              <option value="0">0</option>
              <option value="0.5">0.5</option>
              <option value="1">1</option>
              <option value="1.5">1.5</option>
              <option value="2">2</option>
            </select>
          </label>

          {hoursPerDay[index].worktime === "Erreur" ? <p>Erreur</p> : <p>Nombre d'heure travailler: {hoursPerDay[index].worktime}</p>}
        </div>
      ))}

      <p>Nombre d'heure de la semaine: {weekWorkTime.totalHours}</p>
      <p>Module: {weekWorkTime.modulationHours}</p>
      <p>heure supp: {weekWorkTime.additionalHours}</p>

      <button onClick={handleCalcHour}>Calcul</button>

      <button onClick={handleSubmit}>Envoyer</button>

      {submitClick ? (
        <WeeklyConfirm daysOfWeek={daysOfWeek} daysOfWeekFr={daysOfWeekFr} hoursPerDay={hoursPerDay} weekWorkTime={weekWorkTime} submitClick={submitClick} setSubmitClick={setSubmitClick} />
      ) : (
        ""
      )}
    </form>
  );
};

export default WeeklyHoursForm;
