import * as React from 'react';
import {useCallback, useState} from "react";
import {TimeSlotTable} from './TimeSlotTable'

export const AppointmentForm = (props) => {
  const {
    selectableServices,
    service,
    onSubmit,
    salonOpensAt,
    salonClosesAt,
    today,
    availableTimeSlots,
    startsAt
  } = props;
  const [appointment, setAppointment] = useState({service, startsAt});

  const handleServiceSelectChange = e => {
    setAppointment((appointment) => ({
      ...appointment,
      service: e.target.value
    }))
  }

  const handleSubmit = e => {
    onSubmit({selectedService: appointment.service, startsAt: appointment.startsAt})
  }

  const handleStartsAtChange = useCallback(
    ({ target: { value } }) =>
      setAppointment(appointment => ({
        ...appointment,
        startsAt: parseInt(value)
      })),
    []
  );

  return <form id="appointment" onSubmit={handleSubmit}>
    <label htmlFor="service">Select a service you need:</label>
    <select name="service" id="service" value={appointment.service} onChange={handleServiceSelectChange}>
      {selectableServices.map((value) => {
        return <option key={value}>{value}</option>
      })}
    </select>
    <TimeSlotTable
      salonOpensAt={salonOpensAt}
      salonClosesAt={salonClosesAt}
      today={today}
      availableTimeSlots={availableTimeSlots}
      handleChange={handleStartsAtChange}
      startsAt={appointment.startsAt}
    />
    <input type='submit' value={'Select'} name={'serviceSubmitBtn'}/>
  </form>
};

const defaultServices = [
  'Cut',
  'Blow-dry',
  'Cut & color',
  'Beard trim',
  'Cut & beard trim',
  'Extensions']

AppointmentForm.defaultProps = {
  selectableServices: defaultServices,
  service: defaultServices[0],
  submitted: () => {},
  salonOpensAt: 9,
  salonClosesAt: 19,
  today: new Date(),
  availableTimeSlots: [],
}
