import React from "react";

const SentData = (hoursSent, setHoursSent, planningSent, setPlanningSent) => {
  return (
    <div className={(planningSent === true) & (hoursSent === true) ? "none" : "success"}>
      <h3>✅ Données envoyées avec succès!</h3>
    </div>
  );
};

export default SentData;
