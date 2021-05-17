import * as React from "react";
import { useState } from 'react';

export const CustomerForm = ({firstName, lastName, phoneNumber, onSave}) => {
  const [customer, setCustomer] = useState({firstName, lastName, phoneNumber});
  const [error, setError] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});

  const handleChange = ({target}) => {
    return setCustomer(customer => ({
      ...customer,
      [target.name]: target.value
    }));
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await window.fetch('/customers', {
      method: 'POST',
      credentials: 'same-origin',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer)
    });
    if (result.ok) {
      error && setError(false);
      onSave(await result.json());
    } else {
      setError(true)
    }
  };

  const Error = () => (
    <div className="error">An error occurred during save.</div>
  );

  const required = (name, value): string | undefined => {
    return !value || value.trim() === ''
      ? `${name} is required`
      : undefined;
  }

  const handleBlur = ({target}) => {
    setValidationErrors({
      ...validationErrors,
      [target.name]: required(target.name, target.value)
    });
  };

  const hasErrors = (): boolean => {
    return !!Object.keys(validationErrors).length
  }

  const renderValidationErrorFor = (fieldName: string) => {
    if (hasErrors()) {
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
      <input type="submit" value="Add" />
      {renderValidationErrorFor('phoneNumber')}
    </form>
  );
};

CustomerForm.defaultProps = {
  onSave: () => {}
};
