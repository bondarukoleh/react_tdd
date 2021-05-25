import * as React from 'react';
import {useState, useCallback} from 'react';
import * as ReactDOM from 'react-dom';
import {AppointmentsDayViewLoader} from './containers/AppointmentsDayViewLoader';
import {CustomerForm} from './components/CustomerForm';
import {AppointmentFormLoader} from "./containers/AppointmentFormLoader";
import {CustomerSearch} from "./components/CustomerSearch";
import {Link, Redirect, Route, Switch} from 'react-router-dom'

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
  const [customer, setCustomer] = useState(null);

  const customerSave = useCallback(
    (customerData) => {
      setCustomer(customerData);
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
        render={(props) => <CustomerForm {...props} onSave={customerSave} {...customer} />}
        exact
      />
      <Route
        path={Routes.addAppointment}
        exact
        render={(props) => <AppointmentFormLoader {...props} customer={customer} onSubmit={appointmentSubmit} />}
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
