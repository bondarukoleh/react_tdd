import React from 'react';
import ReactDOM from 'react-dom';
import 'whatwg-fetch';
import { AppointmentForm } from './components/AppointmentForm';
import {
  sampleAvailableTimeSlots,
  sampleStylists
} from './data/sampleData';
import './styles.css'

ReactDOM.render(
  <AppointmentForm
    availableTimeSlots={sampleAvailableTimeSlots}
  />,
  document.getElementById('root')
);
