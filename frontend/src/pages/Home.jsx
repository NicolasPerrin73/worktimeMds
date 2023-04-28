import React, { useEffect } from "react";
import { useUserdata } from "../hooks/hooks";
import Header from "../components/Header";
import { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import timeGridPlugin from "@fullcalendar/timegrid";
import frLocale from "@fullcalendar/core/locales/fr";

import WeeklyHoursForm from "../components/WeeklyHoursForm";
import axios from "axios";
import CountingHours from "../components/CountingHours";

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
  const [hoursData, setDataHours] = useState([]);
  const [totalWorkedHours, setTotalWorkedHours] = useState();
  const [totalModulationHours, setTotalModulationHours] = useState();
  const [totalAdditionalHours, setTotalAdditionalHours] = useState();
  const [totalCpCount, setTotalCpCount] = useState();

  //Get events from DB
  useEffect(() => {
    setIsLoading(true);
    const token = localStorage.getItem("token");
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/planning/planning`,

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

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios
      .get(
        `${process.env.REACT_APP_API_URL}/api/planning/hours`,

        { headers: { Authorization: `Bearer ${token}` } }
      )
      .then((res) => {
        const data = res.data;
        setDataHours(data);
        calcTotalWorkedHours(data);
      })
      .then(() => {})
      .catch((err) => {
        console.log(err);
      });
  }, [dataSent]);

  const calcTotalWorkedHours = (data) => {
    const totalWorkedHours = data.reduce((acc, curr) => acc + curr.total_worked_hours, 0);
    setTotalWorkedHours(totalWorkedHours);
    const totalModulationHours = data.reduce((acc, curr) => acc + curr.total_modulation_hours, 0);
    setTotalModulationHours(totalModulationHours);
    const totalAdditionalHours = data.reduce((acc, curr) => acc + curr.total_additional_hours, 0);
    setTotalAdditionalHours(totalAdditionalHours);
    const totalCpCount = data.reduce((acc, curr) => acc + curr.total_cp_hours, 0);
    setTotalCpCount(totalCpCount / 7);
  };

  const handleEventClik = () => {
    console.log("click");
  };

  return (
    <>
      <Header userData={userData} totalWorkedHours={totalWorkedHours} totalModulationHours={totalModulationHours} totalAdditionalHours={totalAdditionalHours} />
      <CountingHours totalWorkedHours={totalWorkedHours} totalModulationHours={totalModulationHours} totalAdditionalHours={totalAdditionalHours} totalCpCount={totalCpCount} />
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
          timeZone="local"
          eventClick={handleEventClik}
        />
      )}
    </>
  );
};

export default Home;
