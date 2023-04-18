import React, { useEffect } from "react";
import { useUserdata } from "../hooks/hooks";
import Header from "../components/Header";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";

import WeeklyHoursForm from "../components/WeeklyHoursForm";
import axios from "axios";

const Home = () => {
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
        "https://minidev.fr:3010/api/planning/planning",

        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const data = res.data;
        setEventInDB(data);
        setTimeout(() => {
          setIsLoading(false);
        }, 500);
        setIsLoading(false);
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }, [dataSent]);

  const handleEventClik = () => {
    console.log("click");
  };

  return (
    <>
      <Header userData={userData} />
      <WeeklyHoursForm events={events} setEvents={setEvents} dataSent={dataSent} setDataSent={setDataSent} />
      {isLoading ? (
        ""
      ) : (
        <FullCalendar
          plugins={[timeGridPlugin]}
          initialView="timeGridWeek"
          events={eventsInDB}
          locale={frLocale}
          allDaySlot={false}
          weekNumbers={true}
          slotDuration="01:00:00"
          height={700}
          timeZone="UTC"
          eventClick={handleEventClik}
        />
      )}
    </>
  );
};

export default Home;
