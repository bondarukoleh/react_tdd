import * as React from 'react';
import {useState, useCallback} from 'react';
import * as ReactDOM from 'react-dom';
import {AppointmentsDayViewLoader} from './containers/AppointmentsDayViewLoader';
import {CustomerForm} from './components/CustomerForm';
import {AppointmentFormLoader} from "./containers/AppointmentFormLoader";

enum Routes {
  dayView = 'dayView',
  addCustomer = 'addCustomer',
  addAppointment = 'addAppointment',
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

  const renderDayView = () => {
    return (
      <React.Fragment>
      <div className="button-bar">
        <button type="button" id="addCustomer" onClick={addCustomerClickHandle}>
          Add customer and appointment
        </button>
      </div>
      <AppointmentsDayViewLoader />
    </React.Fragment>
    );
  }

  switch(view) {
    case Routes.addCustomer:
      return <CustomerForm onSave={customerSave} />
    case Routes.addAppointment:
      return <AppointmentFormLoader customer={customer} onSubmit={appointmentSubmit} />
    default:
      return renderDayView()
  }
};
