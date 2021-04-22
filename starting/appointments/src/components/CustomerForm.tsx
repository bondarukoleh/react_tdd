import * as React from 'react'

export const CustomerForm = (props) => {
  const {firstName} = props;

  return <form id="customer">
    <input
      type="text"
      name="firstName"
      value={firstName}
      onChange={() => {}}
    />
  </form>
};
