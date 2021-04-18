import React from 'react';

export const Appointment = props => {
  const {customer, startsAt} = props;

  return <div id={'appointment'}>
    <p>Name: {customer.firstName}</p>
    <p>Starts at: {startsAt}</p>
  </div>;
};

