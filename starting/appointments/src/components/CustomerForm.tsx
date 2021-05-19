import * as React from "react";
import { useState } from 'react';
import {
  required,
  match,
  list,
  hasError,
  validateMany,
  anyErrors
} from '../helpers/formValidation';

export const CustomerForm = ({firstName, lastName, phoneNumber, onSave}) => {
  const [customer, setCustomer] = useState({firstName, lastName, phoneNumber});
  const [error, setError] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = ({target}) => {
    return setCustomer(customer => ({
      ...customer,
      [target.name]: target.value
    }));
  }

  const Error = () => (
    <div className="error">An error occurred during save.</div>
  );

  const validators = {
    firstName: required('First name'),
    lastName: required('Last name'),
    phoneNumber: list(
      required('Phone number'),
      match(
        /^[0-9+()\- ]*$/,
        'Only numbers, spaces and these symbols are allowed: ( ) + -'
      )
    )
  }

  const handleBlur = ({target}) => {
    const result = validateMany(validators, {[target.name]: target.value});
    setValidationErrors({...validationErrors, ...result});
  };

  const postCustomer = (customer) => window.fetch('/customers', {
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify(customer)
  });

  const doSubmit = async () => {

  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = validateMany(validators, customer);
    if (!anyErrors(validationResult)) {
      setSubmitting(true);
      const result = await postCustomer(customer);
      setSubmitting(false);
      if (result.ok) {
        error && setError(false);
        onSave(await result.json());
      } else if (result.status === 422) {
        const response = await result.json();
        setValidationErrors(response.errors);
      } else {
        setError(true)
      }
    } else {
      setSubmitting(false);
      setValidationErrors(validationResult);
    }
  };

  const renderValidationErrorFor = (fieldName: string) => {
    if (hasError(validationErrors, fieldName)) {
      return (
        <span className="error">{validationErrors[fieldName]}</span>
      );
    }
  };

  return (
    <form id="customer" onSubmit={handleSubmit}>
      { error ? <Error /> : null }
      <label htmlFor="firstName">First name</label>
      <input
        type="text"
        name="firstName"
        id="firstName"
        value={firstName}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {renderValidationErrorFor('firstName')}

      <label htmlFor="lastName">Last name</label>
      <input
        type="text"
        name="lastName"
        id="lastName"
        value={lastName}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      {renderValidationErrorFor('lastName')}

      <label htmlFor="phoneNumber">Phone number</label>
      <input
        type="text"
        name="phoneNumber"
        id="phoneNumber"
        value={phoneNumber}
        onChange={handleChange}
        onBlur={handleBlur}
      />
      <input type="submit" value="Add" disabled={submitting} />
      {renderValidationErrorFor('phoneNumber')}
      {submitting && <span className="submittingIndicator" />}
    </form>
  );
};

CustomerForm.defaultProps = {
  onSave: () => {}
};
