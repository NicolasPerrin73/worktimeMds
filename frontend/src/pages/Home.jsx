import React, { useEffect } from "react";
import { useUserdata } from "../hooks/hooks";
import Header from "../components/Header";
import { useState } from "react";
import moment from "moment";
import FullCalendar from "@fullcalendar/react"; // must go before plugins
import dayGridPlugin from "@fullcalendar/daygrid"; // a plugin!
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";

import WeeklyHoursForm from "../components/WeeklyHoursForm";
import axios from "axios";

const Home = () => {
  // Redirection if no token in localStorage
  if (localStorage.length === 0) {
    window.location.href = "/login";
  }
  // Custom hook
  const { userData } = useUserdata();
  const [eventsInDB, setEventInDB] = useState([
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
  ]);
  const [events, setEvents] = useState([
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
    { title: "", start: "", end: "" },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [dataSent, setDataSent] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(
        "http://localhost:3009/api/planning/planning",

        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const data = res.data;
        setEventInDB(data);
        setIsLoading(false);
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }, [dataSent]);

  return (
    <>
      <Header userData={userData} />
      <WeeklyHoursForm events={events} setEvents={setEvents} dataSent={dataSent} setDataSent={setDataSent} />
      {isLoading ? "" : <FullCalendar plugins={[timeGridPlugin]} initialView="timeGridWeek" events={eventsInDB} locale={frLocale} allDaySlot={false} weekNumbers={true} />}
    </>
  );
};

export default Home;
