import React from "react";
import { useState } from "react";
import logo from "../assets/logo.png";

const Header = ({ userData }) => {
  return (
    <>
      <header className="header">
        <img src={logo} alt="logo de la mer de sable" className="header__logo" />
        <span>
          {userData.first_name} <br /> {userData.last_name}
        </span>
      </header>
    </>
  );
};

export default Header;
