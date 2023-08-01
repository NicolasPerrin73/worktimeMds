import axios from "axios";
import React, { useState } from "react";

const WeeklyConfirm = ({
  daysOfWeek,
  hoursPerDay,
  weekWorkTime,
  submitClick,
  setSubmitClick,
  events,
  dataSent,
  setDataSent,
  errorCode,
  setErrorCode,
  errorMessage,
  setErrorMessage,
  networkError,
  setNetworkError,
  hoursSent,
  setHoursSent,
  planningSent,
  setPlanningSent,
}) => {
  const handleSend = (e) => {
    const data = [hoursPerDay, weekWorkTime, events];
    console.log("envoie api");
    setSubmitClick(false);
    const token = localStorage.getItem("token");
    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/planning/hours`,
        {
          data,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        if (res.status === 200) {
          setHoursSent(true);
          setTimeout(() => {
            setHoursSent(false);
          }, 2000);
        }
      })
      .catch((err) => {
        console.log(err);
        setNetworkError(true);
        setErrorCode(err.code);
        setErrorMessage(err.message);
      });

    axios
      .post(
        `${process.env.REACT_APP_API_URL}/api/planning/planning`,
        {
          data,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        console.log(res);
        setDataSent(true);
        setPlanningSent(true);
        setTimeout(() => {
          setPlanningSent(false);
        }, 2000);
        setTimeout(() => {
          setDataSent(false);
        }, 1000);
      })
      .catch((err) => {
        console.log(err);
        setNetworkError(true);
        setErrorCode(err.code);
        setErrorMessage(err.message);
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
              {daysOfWeek[index].dateFr}: <strong> {events[index].title}</strong>
              <br />{" "}
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
