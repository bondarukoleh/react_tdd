import * as React from 'react';
import {useState, useCallback} from 'react';
import * as ReactDOM from 'react-dom';
import {AppointmentsDayViewLoader} from './containers/AppointmentsDayViewLoader';
import {CustomerForm} from './components/CustomerForm';
import {AppointmentFormLoader} from "./containers/AppointmentFormLoader";
import {CustomerSearch} from "./components/CustomerSearch";

enum Routes {
  dayView = 'dayView',
  addCustomer = 'addCustomer',
  addAppointment = 'addAppointment',
  searchCustomers = 'searchCustomers',
}

export const App = () => {
  const [view, setView] = useState(Routes.dayView);
  const [customer, setCustomer] = useState(null);

  const addCustomerClickHandle = useCallback(
    () => setView(Routes.addCustomer),
    []
  );

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

  const renderDayView = () => {
    return (
      <React.Fragment>
        <div className="button-bar">
          <button
            type="button"
            id="addCustomer"
            onClick={addCustomerClickHandle}
          >
            Add customer and appointment
          </button>
          <button
            type="button"
            id="searchCustomers"
            onClick={toSearchCustomers}
          >
            Search customers
          </button>
        </div>
        <AppointmentsDayViewLoader/>
      </React.Fragment>
    );
  }

  switch(view) {
    case Routes.addCustomer:
      return <CustomerForm onSave={customerSave} {...customer} />
    case Routes.addAppointment:
      return <AppointmentFormLoader customer={customer} onSubmit={appointmentSubmit} />
    case Routes.searchCustomers:
      return <CustomerSearch renderCustomerActions={searchActions} />
    default:
      return renderDayView()
  }
};
