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

  const Error = () => (
    <div className="error">An error occurred during save.</div>
  );

  const match = (regex, description) => value => !value.match(regex) ? description : undefined;

  const list = (...validators) => {
    return (value) => {
      return validators.reduce((result, validator) => {
        return result || validator(value)
      }, undefined);
    }
  }

  const anyErrors = errors => Object.values(errors).some(error => error !== undefined);

  const hasErrors = (fieldName): boolean => {
    return !!validationErrors[fieldName]
  }

  const required = (name): (value: any) => string | undefined => {
    return (value: any) => {
      return !value || value.trim() === ''
        ? `${name} is required`
        : undefined;
    }
  }

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
    setValidationErrors({
      ...validationErrors,
      [target.name]: validators[target.name](target.value)
    });
  };

  const validateMany = fields =>
    Object.entries(fields).reduce(
      (result, [name, value]) => ({
        ...result,
        [name]: validators[name](value)
      }), {});

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = validateMany(customer);
    if (!anyErrors(validationResult)) {
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
    } else {
      setValidationErrors(validationResult);
    }
  };

  const renderValidationErrorFor = (fieldName: string) => {
    if (hasErrors(fieldName)) {
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
