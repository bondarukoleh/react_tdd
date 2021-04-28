import * as React from 'react';
import {useState} from "react";

const TimeSlotTable = ({salonOpensAt, salonClosesAt, today, availableTimeSlots}) => {
  const timeIncrements = (numTimes, startTime, increment) => {
    return Array(numTimes)
      .fill([startTime])
      .reduce((acc, _, i) => acc.concat([startTime + (i * increment)])) // [ 1619420400000, 1619425800000, ... ]
  };

  const dailyTimeSlots = (salonOpensAt, salonClosesAt) => {
    const totalSlots = (salonClosesAt - salonOpensAt) * 2;
    const startTime = new Date().setHours(salonOpensAt, 0, 0, 0); // 1619420400000
    const increment = 30 * 60 * 1000;
    return timeIncrements(totalSlots, startTime, increment)
  };

  const weeklyDateValues = (startDate) => {
    const midnight = new Date(startDate).setHours(0, 0, 0, 0);
    const increment = 24 * 60 * 60 * 1000;
    return timeIncrements(7, midnight, increment)
  };

  const toShortDate = timestamp => {
    const [day, , dayOfMonth] = new Date(timestamp).toDateString().split(' ');
    return `${day} ${dayOfMonth}`;
  };

  const toTimeValue = timestamp => new Date(timestamp).toTimeString().substring(0, 5); // 1619420400000 -> '09:00'
  const timeSlots = dailyTimeSlots(salonOpensAt, salonClosesAt);
  const dates = weeklyDateValues(today);

  return (
    <table id="time-slots">
      <thead>
      <tr>
        <th />
        {dates.map(d => (
          <th key={d}>{toShortDate(d)}</th>
        ))}
      </tr>
      </thead>
      <tbody>
      {timeSlots.map(timeSlot => (
        <tr key={timeSlot}>
          <th>{toTimeValue(timeSlot)}</th>
          {dates.map(date => {
            return <td key={date}>
              <RadioButtonIfAvailable
                availableTimeSlots={availableTimeSlots}
                date={date}
                timeSlot={timeSlot}
              />
            </td>
          }
          )}
        </tr>
      ))}
      </tbody>
    </table>
  );
};

const RadioButtonIfAvailable = ({availableTimeSlots, date, timeSlot}) => {
  const mergeDateAndTime = (date, timeSlot) => {
    const time = new Date(timeSlot);
    return new Date(date).setHours(
      time.getHours(),
      time.getMinutes(),
      time.getSeconds(),
      time.getMilliseconds()
    );
  };
  const startsAt = mergeDateAndTime(date, timeSlot);
  if (availableTimeSlots.some(timeSlot => timeSlot.startsAt === startsAt)) {
    return <input name="startsAt" type="radio" value={startsAt} />;
  }
  return null;
};

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
