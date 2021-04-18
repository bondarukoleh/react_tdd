import React from "react";
import ReactDOM from 'react-dom';
import {AppointmentsDayView} from './AppointmentsDayView';
import {sampleAppointments} from '../data/sampleData';

ReactDOM.render(<AppointmentsDayView appointments={sampleAppointments}/>,
  document.getElementById('root'));


