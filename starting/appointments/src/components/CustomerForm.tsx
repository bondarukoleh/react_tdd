import * as React from 'react'
import {useState} from "react";

// interface ICustomerForm {
//   firstName?: string,
//   submitted?: () => void
// }

export const CustomerForm = (props) => {
  const {firstName, surName, telephone, submitted} = props;
  const [formFirstNameValue, setFormFirstName] = useState(firstName)
  const [formSurNameValue, setFormSurName] = useState(surName)
  const [formTelephoneValue, setFormTelephone] = useState(telephone)

  const submitHandler = () => {
    submitted({
      firstName: formFirstNameValue,
      surName: formSurNameValue,
      telephone: formTelephoneValue
    })
  }

  return <form id="customer" onSubmit={submitHandler}>
    <label htmlFor="firstName">First name</label>
    <input
      type="text"
      name="firstName"
      value={formFirstNameValue}
      id="firstName"
      onChange={(e) => setFormFirstName(e.target.value)}
    />
    <label htmlFor="surName">Sur name</label>
    <input
      type="text"
      name="surName"
      value={formSurNameValue}
      id="surName"
      onChange={(e) => setFormSurName(e.target.value)}
    />
    <label htmlFor="telephone">Telephone</label>
    <input
      type="text"
      name="telephone"
      value={formTelephoneValue}
      id="telephone"
      onChange={(e) => setFormTelephone(e.target.value)}
    />
    <input type="submit" value={'Add'} name={'customerSubmitBtn'}/>
  </form>
};
