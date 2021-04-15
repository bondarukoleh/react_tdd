import React, {Fragment} from 'react';
import {Appointment} from './Appointment';

export const AppointmentsDayView = ({appointments}) => {
  return <Fragment>
    <div id={'appointmentsDayView'}>
      <ol>
        {appointments.map((elem, index) => {
          return <Appointment
              key={elem.startsAt}
              customer={elem.customer}
              startsAt={elem.startsAt}
            />
        })}
      </ol>
    </div>
  </Fragment>;
};

