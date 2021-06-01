import * as React from "react";
import {useState} from 'react';
import {connect} from 'react-redux';
import {
  required,
  match,
  list,
  hasError,
  validateMany,
  anyErrors
} from '../helpers/formValidation';
import {Actions, CustomerStatuses} from "../sagas/constans";

const CustomerFormEl = ({
                               firstName,
                               lastName,
                               phoneNumber,
                               serverValidationErrors,
                               error,
                               status,
                               addCustomerRequest
                             }) => {
  const [customer, setCustomer] = useState({firstName, lastName, phoneNumber});
  const [validationErrors, setValidationErrors] = useState({});
  const submitting = status === CustomerStatuses.SUBMITTING;

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationResult = validateMany(validators, customer);
    if (!anyErrors(validationResult)) {
      addCustomerRequest(customer)
    } else {
      setValidationErrors(validationResult)
    }
  }

  const renderValidationErrorFor = (fieldName: string) => {
    const allValidationErrors = {
      ...validationErrors,
      ...serverValidationErrors
    };

    if (hasError(allValidationErrors, fieldName)) {
      return (
        <span className="error">{allValidationErrors[fieldName]}</span>
      );
    }
  };

  return (
    <form id="customer" onSubmit={handleSubmit}>
      {error ? <Error/> : null}
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
      <input type="submit" value="Add" disabled={submitting}/>
      {renderValidationErrorFor('phoneNumber')}
      {submitting && <span className="submittingIndicator"/>}
    </form>
  );
};

const mapStateToProps = (state) => {
  return {
    serverValidationErrors: state.customer.validationErrors,
    error: state.customer.error,
    status: state.customer.status
  }
}

const mapDispatchToProps = {
  addCustomerRequest: (customer) => ({type: Actions.ADD_CUSTOMER_REQUEST, customer})
}

export const CustomerForm = connect(mapStateToProps, mapDispatchToProps)(CustomerFormEl)
