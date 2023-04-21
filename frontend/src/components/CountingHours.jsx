import React from "react";

const CountingHours = ({ totalWorkedHours, totalModulationHours, totalAdditionalHours }) => {
  return (
    <div className="counting">
      <h2>Compteur d'heures:</h2>
      <div className="counting__hours">
        <p>
          Travaillées: <strong>{totalWorkedHours}h</strong>
        </p>
        <p>
          Modulées: <strong> {totalModulationHours}h</strong>
        </p>
        <p>
          Supplémentaires: <strong> {totalAdditionalHours}h</strong>
        </p>
      </div>
    </div>
  );
};

export default CountingHours;
