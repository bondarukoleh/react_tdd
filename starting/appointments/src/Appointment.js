import React, {Fragment} from 'react';

export const Appointment = props => {
  const {customer, startsAt} = props;

  return <li>
        <p>Name: {customer?.firstName}</p>
        <p>Starts at: {startsAt}</p>
    </li>
}

