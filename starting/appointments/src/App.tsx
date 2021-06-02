import * as React from 'react';
import {useState, useCallback} from 'react';
import * as ReactDOM from 'react-dom';
import {AppointmentsDayViewLoader} from './containers/AppointmentsDayViewLoader';
import {CustomerForm} from './components/CustomerForm';
import {AppointmentFormLoader} from "./containers/AppointmentFormLoader";
import {CustomerSearch} from "./components/CustomerSearch";
import {Link, Redirect, Route, Switch} from 'react-router-dom'
import {connect} from "react-redux";
import {Actions} from "./sagas/constans";

export enum Routes {
  dayView = '/',
  addCustomer = '/addCustomer',
  addAppointment = '/addAppointment',
  searchCustomers = '/searchCustomers',
}

export const MainScreen = () => {
  return (
    <React.Fragment>
      <div className="button-bar">
        <Link
          to={Routes.addCustomer}
          className="button"
          id="addCustomer"
        >
          Add customer and appointment
        </Link>
        <Link
          className="button"
          id="searchCustomers"
          to={Routes.searchCustomers}
        >
          Search customers
        </Link>
      </div>
      <AppointmentsDayViewLoader/>
    </React.Fragment>
  );
}

export const App = (props) => {

  const customerSave = useCallback(
    (customerData) => {
      props.setCustomerForAppointment(customerData);
      props.history.push(Routes.addAppointment)
    },
    []
  );

  const appointmentSubmit = useCallback(
    (appointmentData) => {
      props.history.push(Routes.dayView)
    },
    []
  );

  const searchActions = (customer) => (
    <React.Fragment>
      <button
        role="button"
        onClick={() => {
          customerSave(customer)
          props.history.push(Routes.addAppointment)
        }}
      >Create appointment</button>
    </React.Fragment>
  );

  return (
    <Switch>
      <Route
        path={Routes.addCustomer}
        // @ts-ignore
        render={(props) => <CustomerForm {...props} onSave={customerSave} />}
        exact
      />
      <Route
        path={Routes.addAppointment}
        exact
        render={(props) => <AppointmentFormLoader {...props} onSubmit={appointmentSubmit} />}
      />
      <Route
        path={Routes.searchCustomers}
        exact
        render={(props) => <CustomerSearch {...props} renderCustomerActions={searchActions} />}
      />
      <Route
        exact
        path={Routes.dayView} component={MainScreen}
      />
      <Redirect to='/'/>
    </Switch>
  );
};

const mapDispatchToProps = {
  setCustomerForAppointment: customer => ({
    type: Actions.SET_CUSTOMER_FOR_APPOINTMENT,
    customer
  })
};

export const ConnectedApp = connect(
  null,
  mapDispatchToProps
)(App);
