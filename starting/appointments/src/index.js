import React from "react";
import ReactDOM from 'react-dom';
import {AppointmentsDayView} from './components/AppointmentsDayView.jsx';
import {sampleAppointments} from './data/sampleData';

ReactDOM.render(<AppointmentsDayView appointments={sampleAppointments}/>,
  document.getElementById('root'));


