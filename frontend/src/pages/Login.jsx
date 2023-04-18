import React from "react";
import { useState } from "react";
import logo from "../assets/logo.png";
import Email from "../components/Email";
import Password from "../components/Password";
import axios from "axios";
import { Link, Navigate, useNavigate } from "react-router-dom";

/**
 *Component to log in
 * @return {*}
 */
function Login() {
  //Component state
  const [mail, setEmail] = useState([]);
  const [password, setPassword] = useState([]);
  const [loginError, setLoginError] = useState(false);
  const [formEmailIsValid, setFormEmailIsValid] = useState(false);
  const [formPasswordIsValid, setFormPasswordIsValid] = useState(false);
  const [formErrorMessage, setFormErrorMessage] = useState(false);
  const navigate = useNavigate();

  /**
   *Capture OnClick and try to connect user
   *Send mail and password state to backend
   *add token to localStorage, redirection to home
   *or display error message
   * @param {*} e
   */
  const connexion = (e) => {
    if (formEmailIsValid === false || formPasswordIsValid === false) {
      e.preventDefault();
      setFormErrorMessage(true);
    } else if (formEmailIsValid === true && formPasswordIsValid === true) {
      setFormErrorMessage(false);
      e.preventDefault();
      axios
        .post("https://minidev.fr:3010/api/auth/login", {
          email: mail,
          password: password,
        })
        .then(function (res) {
          const token = res.data.token;
          localStorage.setItem("token", token);
          setLoginError(false);
          navigate("/");
        })
        .catch(function (error) {
          setLoginError(true);
        });
    }
  };

  return (
    <>
      <div className="login_container">
        <img src={logo} alt="logo de la mer de sable" className="logo" />

        <section className="login">
          <h1>S'identifier</h1>

          <form className="form">
            <Email email={mail} setEmail={setEmail} formEmailIsValid={formEmailIsValid} setFormEmailIsValid={setFormEmailIsValid} />
            <Password password={password} setPassword={setPassword} formPasswordIsValid={formPasswordIsValid} setFormPasswordIsValid={setFormPasswordIsValid} />

            <button onClick={(e) => connexion(e)}>Connexion</button>

            <span className={formErrorMessage === true ? "form__errorMessage" : "hidden"}>Formulaire invalide</span>

            <div className={loginError === false ? "hidden" : "form__errorMessage"}>
              <i className="fa-sharp fa-solid fa-circle-exclamation"></i>
              <span>Identifiant et/ou mot de passe erroné</span>
            </div>
          </form>
        </section>

        <section className="login">
          <p>Pas de compte? Inscrivez-vous maintenant!</p>

          <Link to="/signup" className="button">
            <button>Inscription</button>
          </Link>
        </section>
      </div>
    </>
  );
}

export default Login;
