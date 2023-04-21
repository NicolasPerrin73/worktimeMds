import React from "react";
import { useState } from "react";
import { Link } from "react-router-dom";
import logo from "../assets/logo.png";

const Header = ({ userData }) => {
  const handleExit = () => {
    localStorage.clear();
  };

  return (
    <>
      <header className="header">
        <img src={logo} alt="logo de la mer de sable" className="header__logo" />
        <p className="header__name">
          {userData.first_name} <br /> {userData.last_name}
        </p>

        <Link to="/login" onClick={handleExit} className="header__link">
          <i className="fa-solid fa-right-from-bracket"></i>
          <span>Déconnexion</span>
        </Link>
      </header>
    </>
  );
};

export default Header;
