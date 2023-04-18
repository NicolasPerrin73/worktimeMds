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
        "https://minidev.fr:3010/api/planning/hours",
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
        "https://minidev.fr:3010/api/planning/planning",
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
      <ul className="confirm">
        <h2>Merci de verifier les informations avant envoi:</h2>
        {daysOfWeek.map((dayFr, index) => (
          <li key={index}>
            <p>
              {daysOfWeek[index].dateFr}:<br />{" "}
              <strong>
                {hoursPerDay[index].start}-{hoursPerDay[index].end}
              </strong>{" "}
              <br />
              avec <strong>{hoursPerDay[index].pause}h </strong> de pause
            </p>
          </li>
        ))}
        <p className="confirm__result">
          Soit un total de: <br /> <strong>{weekWorkTime.totalHours}h </strong>travaillées <br />
          <strong>{weekWorkTime.modulationHours}h</strong> de modulation, <br /> <strong>{weekWorkTime.additionalHours}h</strong> supplémentaires <br />
          pour la semaine n°
          <strong>{weekWorkTime.weekNumber}</strong>
        </p>

        <div className="buttons">
          <button onClick={handleSend}>Envoyer</button>
          <button onClick={handleCancel}>Annuler</button>
        </div>
      </ul>
    </>
  );
};

export default WeeklyConfirm;
