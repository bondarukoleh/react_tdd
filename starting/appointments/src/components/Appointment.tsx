import React from 'react';
import {appointmentTimeOfDay} from "../helpers/general";

type TAppointment = {
  customer?: {firstName: string, lastName: string, phoneNumber: number},
  stylist?: string,
  service?: string,
  notes?: string,
  startsAt?: string
};

export const Appointment = (props: TAppointment) => {
  const {customer: {firstName, lastName, phoneNumber}, startsAt, notes, service, stylist} = props;
  return <div id={'appointment'}>
    <p>Name: {`${firstName} ${lastName}`}</p>
    <p>Tel: {phoneNumber}</p>
    <p>Stylist: {stylist}</p>
    <p>Service: {service}</p>
    <p>Starts at: {appointmentTimeOfDay(startsAt)}</p>
    <p>Notes: {notes}</p>
  </div>;
};

