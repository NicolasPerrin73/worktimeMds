import React, { useEffect, useState } from "react";
import moment from "moment";
import WeeklyConfirm from "./WeeklyConfirm";
import NetworkError from "./NetworkError";
import SentData from "./SentData";

const WeeklyHoursForm = ({ events, setEvents, dataSent, setDataSent, errorCode, setErrorCode, errorMessage, setErrorMessage, networkError, setNetworkError }) => {
  const [weekNumber, setWeekNumber] = useState("");
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [hoursPerDay, setHoursPerDay] = useState([
    { day: "monday", start: "", end: "", pause: "", worktime: "", type: "", title: "" },
    { day: "tuesday", start: "", end: "", pause: "", worktime: "", type: "", title: "" },
    { day: "wednesday", start: "", end: "", pause: "", worktime: "", type: "", title: "" },
    { day: "thursday", start: "", end: "", pause: "", worktime: "", type: "", title: "" },
    { day: "friday", start: "", end: "", pause: "", worktime: "", type: "", title: "" },
    { day: "saturday", start: "", end: "", pause: "", worktime: "", type: "", title: "" },
    { day: "sunday", start: "", end: "", pause: "", worktime: "", type: "", title: "" },
  ]);
  const [weekWorkTime, setWeekWorkTime] = useState({
    weekNumber: weekNumber,
    totalHours: 0,
    modulationHours: 0,
    additionalHours: 0,
    cpHours: 0,
  });
  const [submitClick, setSubmitClick] = useState(false);
  const [selectedValues, setSelectedValues] = useState(["", "", "", "", "", "", ""]);
  const [daysMissingError, setDaysMissingError] = useState(false);
<<<<<<< HEAD
  const [hoursSent, setHoursSent] = useState(false);
  const [planningSent, setPlanningSent] = useState(false);
=======
>>>>>>> d246019fe56d375233451b2937f40d6c4f2ab563

  useEffect(() => {
    if (daysOfWeek.length !== 0) {
      for (let i = 0; i < hoursPerDay.length; i++) {
        hoursPerDay[i] = { ...hoursPerDay[i], day: daysOfWeek[i].date };
      }
    }
    const eventsArray = hoursPerDay
      .filter(({ start, end, pause }) => start !== "" && end !== "" && pause !== "") // Filter out items with empty start and end
      .map(({ day, start, end, worktime, pause, type, title, index }) => ({
        title: title,
        start: `${day}T${start}:00`,
        end: `${day}T${end}:00`,
        workedHours: worktime,
        weekNumber: weekNumber,
        day: day,
        type: type,
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

  const handleRadioChange = (day, event, index) => {
    const newSelectedValues = [...selectedValues];
    newSelectedValues[index] = event.target.value;
    let title = "";
    let worktime = 0;
    if (event.target.value === "worked") {
      title = "Jour travaillé";
      worktime = 7;
    } else if (event.target.value === "moduled") {
      title = "Jour modulé";
      worktime = 0;
    } else if (event.target.value === "CP") {
      title = "Congé Payé";
      worktime = 7;
    } else if (event.target.value === "off") {
      title = "Repos hebdomadaire";
      worktime = 0;
    } else if (event.target.value === "ATAM") {
      title = "Accident de travail / Arrêt maladie";
      worktime = 7;
    }
    setSelectedValues(newSelectedValues);
    let hoursPerDayNewArray = hoursPerDay.slice();
    hoursPerDayNewArray[index] = { ...hoursPerDayNewArray[index], day: day, start: "08:00", end: "16:00", pause: "01:00", worktime: worktime, type: event.target.value, title: title };
    setHoursPerDay(hoursPerDayNewArray);
  };

  const workTimeCalcul = (i) => {
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
  };

  const weeklyWorkingHours = (totalHours, totalCpHours) => {
    if (totalHours <= 35 && totalCpHours >= 35) {
      setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, modulationHours: 0, additionalHours: 0, cpHours: totalCpHours });
      console.log("totalHours <= 35 && totalCpHours >= 35");
    } else if (totalHours <= 35 && totalCpHours <= 35 && totalCpHours >= 1) {
      setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, modulationHours: 0, additionalHours: 0, cpHours: totalCpHours });
      console.log("totalHours <= 35 && totalCpHours <= 35");
    } else if (totalHours <= 35) {
      setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, modulationHours: totalHours - 35, additionalHours: 0, cpHours: totalCpHours });
      console.log("totalHours <= 35");
    } else if (totalHours <= 42) {
      setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, modulationHours: totalHours - 35, additionalHours: 0, cpHours: totalCpHours });
      console.log("totalHours <= 42");
    } else {
      setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, modulationHours: 7, additionalHours: totalHours - 42, cpHours: totalCpHours });
      console.log("else");
    }
  };

  const calcHours = () => {
    let hoursPerDayNewArray = hoursPerDay.slice();
    for (let i = 0; i < hoursPerDay.length; i++) {
      if (hoursPerDayNewArray[i].type === "worked") {
        let worktime = workTimeCalcul(i);
        hoursPerDayNewArray[i] = { ...hoursPerDayNewArray[i], worktime: worktime };
        setHoursPerDay(hoursPerDayNewArray);
      }
    }
    let cpHoursArray = [];
    let wortimeArray = [];
    let totalHours = 0;
    let totalCpHours = 0;
    for (let i = 0; i < hoursPerDayNewArray.length; i++) {
      if (hoursPerDayNewArray[i].worktime === "Erreur") {
        alert("Erreur de saisie, calcul impossible");
      } else {
        if (hoursPerDayNewArray[i].type === "CP") {
          cpHoursArray.push(hoursPerDayNewArray[i].worktime);
          totalCpHours = cpHoursArray.reduce((accumulator, currentValue) => {
            return accumulator + currentValue;
          }, 0);
          setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, cpHours: totalCpHours });
        } else wortimeArray.push(hoursPerDayNewArray[i].worktime);
        totalHours = wortimeArray.reduce((accumulator, currentValue) => {
          return accumulator + currentValue;
        }, 0);
<<<<<<< HEAD
=======
        console.log(wortimeArray);
        console.log(totalHours);
>>>>>>> d246019fe56d375233451b2937f40d6c4f2ab563
        setWeekWorkTime({ ...weekWorkTime, totalHours: totalHours, cpHours: totalCpHours });
      }
    }
    weeklyWorkingHours(totalHours, totalCpHours);
  };

  const handleCalcHour = (e) => {
    e.preventDefault();
    calcHours();
    if (events.length < 7) {
      setDaysMissingError(true);
    } else {
      setDaysMissingError(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    calcHours();
    if (events.length < 7) {
      setDaysMissingError(true);
    } else {
      setDaysMissingError(false);
      setSubmitClick(true);
    }
  };

  return (
    <>
      <h1>Saisie de planification:</h1>

      <div className="weekForm">
        {(planningSent === true) & (hoursSent === true) ? (
          <SentData setPlanningSent={setPlanningSent} planningSent={planningSent} setHoursSent={setHoursSent} hoursSent={hoursSent} />
        ) : networkError === true ? (
          <NetworkError errorCode={errorCode} errorMessage={errorMessage} networkError={networkError} setNetworkError={setNetworkError} />
        ) : (
          ""
        )}
        {submitClick ? (
          ""
        ) : (
          <div className={(planningSent === true) & (hoursSent === true) ? "none" : ""}>
            <label htmlFor="week" className="weekForm__label weekForm__label--week">
              <span>Semaine n°:</span>
              <input type="number" id="week" value={weekNumber} onChange={handleWeekChange} />
            </label>

            {daysOfWeek.map((dayFr, index) => (
              <ul key={index}>
                <li>{daysOfWeek[index].dateFr}</li>
                <form className="inputRadio">
                  <li>
                    <label htmlFor="typeWorked">
                      <input
                        type="radio"
                        name={`type-${index}`}
                        id="typeWorked"
                        value="worked"
                        checked={selectedValues[index] === "worked"}
                        onChange={(e) => handleRadioChange(daysOfWeek[index].date, e, index)}
                      />
                      JT
                    </label>
                  </li>
                  <li>
                    <label htmlFor="typeModuled">
                      <input
                        type="radio"
                        name={`type-${index}`}
                        id="typeModuled"
                        value="moduled"
                        checked={selectedValues[index] === "moduled"}
                        onChange={(e) => handleRadioChange(daysOfWeek[index].date, e, index)}
                      />
                      JM
                    </label>
                  </li>

                  <li>
                    <label htmlFor="typePaidLeave">
                      <input
                        type="radio"
                        name={`type-${index}`}
                        id="typePaidLeave"
                        value="CP"
                        checked={selectedValues[index] === "CP"}
                        onChange={(e) => handleRadioChange(daysOfWeek[index].date, e, index)}
                      />
                      CP
                    </label>
                  </li>
                  <li>
                    <label htmlFor="typeOff">
                      <input
                        type="radio"
                        name={`type-${index}`}
                        id="typeOff"
                        value="off"
                        checked={selectedValues[index] === "off"}
                        onChange={(e) => handleRadioChange(daysOfWeek[index].date, e, index)}
                      />
                      RH
                    </label>
                  </li>
                  <li>
                    <label htmlFor="typeSickLeave">
                      <input
                        type="radio"
                        name={`type-${index}`}
                        id="typeSickLeave"
                        value="ATAM"
                        checked={selectedValues[index] === "ATAM"}
                        onChange={(e) => handleRadioChange(daysOfWeek[index].date, e, index)}
                      />
                      AT/AM
                    </label>
                  </li>
                </form>

                <div className="weekForm__days">
                  <li>
                    <label htmlFor="start-time" className="weekForm__label">
                      Prise de poste:
                      <input
                        type="time"
                        id="start-time"
                        name="start-time"
                        value={selectedValues[index] === "worked" || selectedValues[index] === "" ? hoursPerDay[index].start : "08:00"}
                        onChange={(e) => handleStartHour(daysOfWeek[index].date, index, e.target.value)}
                      />
                    </label>
                  </li>
                  <li>
                    <label htmlFor="end-time" className="weekForm__label">
                      Fin de poste:
                      <input
                        type="time"
                        id="end-time"
                        name="end-time"
                        value={selectedValues[index] === "worked" || selectedValues[index] === "" ? hoursPerDay[index].end : "16:00"}
                        onChange={(e) => handleEndHour(daysOfWeek[index].date, index, e.target.value)}
                      />
                    </label>
                  </li>

                  <li>
                    <label htmlFor="pause-time" className="weekForm__label">
                      Temps de pause:
                      <input
                        type="time"
                        id="pause-time"
                        name="pause-time"
                        value={selectedValues[index] === "worked" || selectedValues[index] === "" ? hoursPerDay[index].pause : "01:00"}
                        onChange={(e) => handleBreakHour(daysOfWeek[index].date, index, e.target.value)}
                      />
                    </label>
                  </li>
                </div>
                {hoursPerDay[index].worktime === "Erreur" ? <p>Erreur</p> : <p>Nombre d'heures travailler: {hoursPerDay[index].worktime}</p>}
              </ul>
            ))}

            <div className="totalHours">
              {daysMissingError === true ? (
                <p className="form__errorMessage"> ⚠️Merci de remplir toutes les journées de la semaine ⚠️</p>
              ) : (
                <>
                  <p>Nombre d'heure de la semaine: {weekWorkTime.totalHours}</p>
                  <p>Module: {weekWorkTime.modulationHours}</p>
                  <p>heure supp: {weekWorkTime.additionalHours}</p>
                </>
              )}
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
            planningSent={planningSent}
            setPlanningSent={setPlanningSent}
            hoursSent={hoursSent}
            setHoursSent={setHoursSent}
            errorCode={errorCode}
            setErrorCode={setErrorCode}
            errorMessage={errorMessage}
            setErrorMessage={setErrorMessage}
            networkError={networkError}
            setNetworkError={setNetworkError}
          />
        ) : (
          ""
        )}

        <div className="weekForm__legend">
          <h3>Légende:</h3>
          <p>
            <strong>JT:</strong> Jour travaillé, <strong>JM:</strong> Jour Modulé, <strong>CP:</strong> Congé payé, <strong>RH:</strong> Repos Hebdomadaire, <strong>AT/AM:</strong> Accident Travail/
            Arret maladie
          </p>
        </div>
      </div>
    </>
  );
};

export default WeeklyHoursForm;
