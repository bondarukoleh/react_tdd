import * as React from 'react'
import {useState} from "react";

// interface ICustomerForm {
//   firstName?: string,
//   submitted?: () => void
// }

export const CustomerForm = (props) => {
  const {firstName, submitted} = props;
  const [formFirstName, setFormFirstName] = useState(firstName)
  const [formSurName, setFormSurName] = useState('')

  const submitHandler = () => {
    console.log({firstName: formFirstName, surName: formSurName})
    submitted({firstName: formFirstName, surName: formSurName})
  }

  return <form id="customer" onSubmit={submitHandler}>
    <label htmlFor="firstName">First name</label>
    <input
      type="text"
      name="firstName"
      value={formFirstName}
      id="firstName"
      onChange={(e) => setFormFirstName(e.target.value)}
    />
    <input
      type="text"
      name="surName"
      value={formSurName}
      id="surName"
      onChange={(e) => setFormSurName(e.target.value)}
    />
    <button type={'submit'} value={'Submit'} name={'submitBtn'}/>
  </form>
};
