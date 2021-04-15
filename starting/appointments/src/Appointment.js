import React from 'react';

export const Appointment = props => {
  const {customer, startsAt} = props;

  const appointmentTimeOfDay = startsAt => {
    const [h, m] = new Date(startsAt).toTimeString().split(':');
    return `${h}:${m}`;
  }

  return <li>
    <p>Name: {customer.firstName}</p>
    <p>Starts at: {appointmentTimeOfDay(startsAt)}</p>
  </li>;
};

