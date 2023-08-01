import React from "react";

const NetworkError = ({ errorCode, errorMessage, networkError, setNetworkError }) => {
  const closeError = () => {
    setNetworkError(false);
  };

  return (
    <>
      <div className="login_container">
        <div className="network_error">
          <i className="fa-solid fa-circle-xmark" onClick={(e) => closeError()}></i>
          <h3>⚠️ Oups, il y a eut une erreur</h3>
          <p>{errorCode}</p>
          <p>{errorMessage}</p>
        </div>
      </div>
    </>
  );
};

export default NetworkError;
