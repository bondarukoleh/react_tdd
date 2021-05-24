import * as React from 'react';
import {useState, useCallback} from 'react';
import * as ReactDOM from 'react-dom';
import {AppointmentsDayViewLoader} from './containers/AppointmentsDayViewLoader';
import {CustomerForm} from './components/CustomerForm';
import {AppointmentFormLoader} from "./containers/AppointmentFormLoader";
import {CustomerSearch} from "./components/CustomerSearch";
import {Link, Route, Switch} from 'react-router-dom'

enum Routes {
  dayView = 'dayView',
  addCustomer = '/addCustomer',
  addAppointment = 'addAppointment',
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
          type="button"
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

export const App = () => {
  const [view, setView] = useState(Routes.dayView);
  const [customer, setCustomer] = useState(null);

  const customerSave = useCallback(
    (customerData) => {
      setCustomer(customerData);
      setView(Routes.addAppointment)
    },
    []
  );

  const appointmentSubmit = useCallback(
    (appointmentData) => {
      setView(Routes.dayView)
    },
    []
  );

  const searchActions = (customer) => (
    <React.Fragment>
      <button
        role="button"
        onClick={() => customerSave(customer)}
      >Create appointment</button>
    </React.Fragment>
  );

  const toSearchCustomers = useCallback(
    () => setView(Routes.searchCustomers),
    []
  );

  // TODO: move to switch
  // switch(view) {
  //   case Routes.addCustomer:
  //     return
  //   case Routes.addAppointment:
  //     return <AppointmentFormLoader customer={customer} onSubmit={appointmentSubmit} />
  //   case Routes.searchCustomers:
  //     return <CustomerSearch renderCustomerActions={searchActions} />
  //   default:
  //     return
  // }

  return (
    <Switch>
      <Route path={Routes.addCustomer}>
        <CustomerForm onSave={customerSave} {...customer} />
      </Route>
      <Route path={Routes.addAppointment} exact>
        <AppointmentFormLoader customer={customer} onSubmit={appointmentSubmit} />
      </Route>
      <Route path={Routes.searchCustomers} exact>
        <CustomerSearch renderCustomerActions={searchActions} />
      </Route>
      <Route component={MainScreen} />
    </Switch>
  );
};
