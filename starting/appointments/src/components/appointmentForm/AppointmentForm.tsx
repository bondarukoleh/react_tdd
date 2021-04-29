import * as React from 'react';
import {useState} from "react";
import {TimeSlotTable} from './TimeSlotTable'

export const AppointmentForm = (props) => {
  const {
    selectableServices,
    service,
    submitted,
    salonOpensAt,
    salonClosesAt,
    today,
    availableTimeSlots
  } = props;
  const [selectedServiceValue, setSelectedServiceValue] = useState(service);

  const handleServiceSelectChange = e => {
    setSelectedServiceValue(e.target.value)
  }

  const handleSubmit = e => {
    submitted({selectedService: selectedServiceValue})
  }

  return <form id="appointment" onSubmit={handleSubmit}>
    <label htmlFor="service">Select a service you need:</label>
    <select name="service" id="service" value={selectedServiceValue} onChange={handleServiceSelectChange}>
      {selectableServices.map((value) => {
        return <option key={value}>{value}</option>
      })}
    </select>
    <TimeSlotTable
      salonOpensAt={salonOpensAt}
      salonClosesAt={salonClosesAt}
      today={today}
      availableTimeSlots={availableTimeSlots}
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
