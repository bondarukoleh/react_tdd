import * as React from 'react'

export const CustomerForm = (props) => {
  const {firstName} = props;

  return <form id="customer">
    <label htmlFor="firstName">First name</label>
    <input
      type="text"
      name="firstName"
      value={firstName}
      id="firstName"
      onChange={() => {}}
    />
  </form>
};
