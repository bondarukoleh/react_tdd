import React, {Fragment, useState} from 'react';
import {Appointment} from './Appointment.tsx';
import {appointmentTimeOfDay} from "../helpers/general";

export const AppointmentsDayView = ({appointments}) => {
  const [appointmentToShow, setAppointmentToShow] = useState(0);

  const showAppointment = (appointmentId) => setAppointmentToShow(appointmentId);

  const renderNoAppointment = () => <p>There are no appointments scheduled for today.</p>;

  const renderAppointment = () => {
    const {customer, startsAt, stylist, service, notes} = appointments[appointmentToShow];

    return <Appointment
      customer={customer}
      startsAt={startsAt}
      stylist={stylist}
      service={service}
      notes={notes}
    />;
  };

  const renderAppointmentsList = () => {
    return <Fragment>
      <ol>
        {appointments.map((elem, i) => (
          <li key={elem.id}>
            <button type="button" onClick={() => showAppointment(i)}>
              {appointmentTimeOfDay(elem.startsAt)}
            </button>
          </li>))}
      </ol>
      {renderAppointment(appointmentToShow)}
    </Fragment>;
  };

  return <div id="appointmentsDayView">
      {appointments?.length
        ? renderAppointmentsList()
        : renderNoAppointment()}
    </div>
};

