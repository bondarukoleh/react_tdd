import React, {Fragment} from 'react';

export const Appointment = props => {
  const {customer: {firstName}} = props;

  return <Fragment>
    <div>{firstName}</div>
  </Fragment>
}
