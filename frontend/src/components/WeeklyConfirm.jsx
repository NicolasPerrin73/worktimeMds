import axios from "axios";
import React from "react";

const WeeklyConfirm = ({ daysOfWeek, hoursPerDay, weekWorkTime, submitClick, setSubmitClick, events, dataSent, setDataSent }) => {
  const handleSend = (e) => {
    const data = [hoursPerDay, weekWorkTime, events];
    console.log("envoie api");
    setSubmitClick(false);
    const token = localStorage.getItem("token");
    axios
      .post(
        "http://localhost:3009/api/planning/hours",
        {
          data,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });

    axios
      .post(
        "http://localhost:3009/api/planning/planning",
        {
          data,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        setDataSent(true);
        setTimeout(() => {
          setDataSent(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
      });
  };

  const handleCancel = (e) => {
    console.log("annuler");
    setSubmitClick(false);
  };

  return (
    <>
      <div>
        <h2>Merci de verifier les informations avant envoi:</h2>
        {daysOfWeek.map((dayFr, index) => (
          <div key={index}>
            <p>
              {daysOfWeek[index].dateFr}: {hoursPerDay[index].start}-{hoursPerDay[index].end} avec {hoursPerDay[index].pause}h de pause
            </p>
          </div>
        ))}
        <p>
          Soit un total de: {weekWorkTime.totalHours} dont {weekWorkTime.modulationHours}h de modulation, et {weekWorkTime.additionalHours}h d'heures supplémentaires pour la semaine n°
          {weekWorkTime.weekNumber}
        </p>
      </div>
      <button onClick={handleSend}>Envoyer</button>
      <button onClick={handleCancel}>Annuler</button>
    </>
  );
};

export default WeeklyConfirm;
