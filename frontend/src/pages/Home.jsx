import React from "react";
import { useUserdata } from "../hooks/hooks";
import Header from "../components/Header";
import { useState } from "react";
import moment from "moment";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!

import WeeklyHoursForm from "../components/WeeklyHoursForm";

const Home = () => {
  // Redirection if no token in localStorage
  if (localStorage.length === 0) {
    window.location.href = "/login";
  }
  // Custom hook
  const { userData } = useUserdata();

  return (
    <>
      <Header userData={userData} />
      <WeeklyHoursForm />
      <FullCalendar plugins={[dayGridPlugin]} initialView="dayGridMonth" />
    </>
  );
};

export default Home;
