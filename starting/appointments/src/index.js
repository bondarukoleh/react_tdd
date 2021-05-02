import React from "react";
import ReactDOM from 'react-dom';
import {AppointmentsDayView} from './components/AppointmentsDayView.jsx';
import {sampleAppointments} from './data/sampleData';
import './styles.css'
import {AppointmentForm} from "./components/appointmentForm/AppointmentForm";

ReactDOM.render(<AppointmentForm />,
  document.getElementById('root'));


