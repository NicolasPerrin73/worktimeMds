import React, { useEffect, useState } from "react";
import { startOfWeek, addDays } from "date-fns";
import moment from "moment";

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
  const [weekWorkTime, setWeekWorkTime] = useState({ weekNumber: weekNumber, totalHours: 0, modulationHours: 0, additionalHours: 0 });

  function getDaysOfWeek(weekNumber) {
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
  }

  const handleWeekChange = (e) => {
    setWeekNumber(e.target.value);
    getDaysOfWeek(e.target.value);
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

  const calc = (i) => {
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
      const wortimeResult = diffInHours - Number(hoursPerDay[i].pause);

      return wortimeResult;
    }
  };

  const handleCalcHour = (e) => {
    e.preventDefault();
    let hoursPerDayNewArray = hoursPerDay.slice();
    for (let i = 0; i < hoursPerDay.length; i++) {
      let worktime = calc(i);
      calc(i);
      hoursPerDayNewArray[i] = { ...hoursPerDayNewArray[i], worktime: worktime };
      setHoursPerDay(hoursPerDayNewArray);
    }
    let wortimeArray = [];
    let totalHours = 0;
    for (let i = 0; i < hoursPerDayNewArray.length; i++) {
      wortimeArray.push(hoursPerDayNewArray[i].worktime);
      totalHours = wortimeArray.reduce((accumulator, currentValue) => {
        return accumulator + currentValue;
      });
      setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours });
    }

    function calculerHeures(h) {
      if (h <= 35) {
        setWeekWorkTime({ ...weekWorkTime, totalHours: h, modulationHours: 0, additionalHours: 0 });
      } else if (h <= 42) {
        setWeekWorkTime({ ...weekWorkTime, totalHours: h, modulationHours: h - 35, additionalHours: 0 });
      } else {
        return setWeekWorkTime({ ...weekWorkTime, totalHours: h, modulationHours: 7, additionalHours: h - 42 });
      }
    }
    calculerHeures(totalHours);
  };

  const handleSubmit = (e) => {
    e.preventDefault();

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
            <select onChange={(e) => handleStartHour(day, index, e.target.value)}>
              <option value="">Début</option>
              <option value="05:00">05:00</option>
              <option value="07:00">06:00</option>
              <option value="07:00">07:00</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="20:00">22:00</option>
            </select>
          </label>
          <label>
            Fin de poste:
            <select onChange={(e) => handleEndHour(day, index, e.target.value)}>
              <option value="">Fin</option>
              <option value="05:00">05:00</option>
              <option value="07:00">06:00</option>
              <option value="07:00">07:00</option>
              <option value="08:00">08:00</option>
              <option value="09:00">09:00</option>
              <option value="10:00">10:00</option>
              <option value="11:00">11:00</option>
              <option value="12:00">12:00</option>
              <option value="13:00">13:00</option>
              <option value="14:00">14:00</option>
              <option value="15:00">15:00</option>
              <option value="16:00">16:00</option>
              <option value="17:00">17:00</option>
              <option value="18:00">18:00</option>
              <option value="19:00">19:00</option>
              <option value="20:00">20:00</option>
              <option value="21:00">21:00</option>
              <option value="20:00">22:00</option>
            </select>
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
          <p>Nombre d'heure travailler: {hoursPerDay[index].worktime}</p>
        </div>
      ))}

      <p>Nombre d'heure de la semaine: {weekWorkTime.totalHours}</p>
      <p>Module: {weekWorkTime.modulationHours}</p>
      <p>heure supp: {weekWorkTime.additionalHours}</p>

      <button onClick={handleCalcHour}>Calcul</button>

      <button type="submit">Submit</button>
    </form>
  );
};

export default WeeklyHoursForm;
