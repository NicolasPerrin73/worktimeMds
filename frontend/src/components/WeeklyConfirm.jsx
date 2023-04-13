import React from "react";

const WeeklyConfirm = ({ daysOfWeek, daysOfWeekFr, hoursPerDay, weekWorkTime, submitClick, setSubmitClick }) => {
  const handleSend = (e) => {
    console.log("envoie api");
    setSubmitClick(false);
  };

  const handleCancel = (e) => {
    console.log("annuler");
    setSubmitClick(false);
  };

  return (
    <>
      <div>
        <h2>Merci de verifier les informations avant envoi:</h2>
        {daysOfWeekFr.map((day, index) => (
          <div key={day}>
            <p>
              {day}: {hoursPerDay[index].start}-{hoursPerDay[index].end} avec {hoursPerDay[index].pause}h de pause
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
