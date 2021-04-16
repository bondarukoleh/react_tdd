import React, {Fragment} from 'react';
import {Appointment} from './Appointment';

export const AppointmentsDayView = ({appointments}) => {
  return <Fragment>
    <div id={'appointmentsDayView'}>
      <ol>
        {appointments?.length
          ? appointments.map((elem) => {
            return <Appointment
              key={elem.startsAt}
              customer={elem.customer}
              startsAt={elem.startsAt}
            />;
          })
          : <p>There are no appointments scheduled for today.</p>}
      </ol>
    </div>
  </Fragment>;
};

