import React, {Fragment, useState} from 'react';
import {Appointment} from './Appointment';

export const AppointmentsDayView = ({appointments}) => {
  const [appointmentToShow, setAppointmentToShow] = useState(0);

  const appointmentTimeOfDay = startsAt => {
    const [h, m] = new Date(startsAt).toTimeString().split(':');
    return `${h}:${m}`;
  };
  const showAppointment = (appointmentId) => setAppointmentToShow(appointmentId);

  const renderNoAppointment = () => <p>There are no appointments scheduled for today.</p>;

  const renderAppointment = () => {
    const {customer, startsAt} = appointments[appointmentToShow];
    return <Appointment
      customer={customer}
      startsAt={startsAt}
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

  return <Fragment>
    <div id={'appointmentsDayView'}>
      {appointments?.length
        ? renderAppointmentsList()
        : renderNoAppointment()}
    </div>
  </Fragment>;
};

