import * as React from 'react';

export const AppointmentForm = (props) => {
  const {selectableServices} = props;

  return <form id="appointment">
    <select name="service">
      {selectableServices.length ? selectableServices.map((value) => {
        return <option key={value}>{value}</option>
      }) : <option/>}
    </select>

  </form>
};
