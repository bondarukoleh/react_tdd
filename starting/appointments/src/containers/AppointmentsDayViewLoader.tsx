import * as React from "react";
import {useEffect, useState} from 'react';
import {AppointmentsDayView} from "../components/AppointmentsDayView";

export const AppointmentsDayViewLoader = ({today}) => {
  const [availableAppointments, setAvailableAppointments] = useState([]);

  useEffect(() => {
    const fetchAvailableAppointments = async () => {
      const from = today.setHours(0, 0, 0, 0);
      const to = today.setHours(23, 59, 59, 999);
      const result = await window.fetch(`/appointments/${from}-${to}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      });
      setAvailableAppointments(await result.json());
    };
    fetchAvailableAppointments();
  }, [today]);

  return (
    <AppointmentsDayView appointments={availableAppointments}/>
  )
};

AppointmentsDayViewLoader.defaultProps = {
  today: new Date()
};
