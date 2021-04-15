import React from 'react';
import {render} from 'react-dom';
import {Appointment} from '../src/Appointment';
import {AppointmentsDayView} from '../src/AppointmentsDayView';

describe('Appointment', function () {
  let container;
  let customer;

  beforeEach(() => {
    container = document.createElement('div');
  })

  it('renders the customer first name ', () => {
    customer = { firstName: 'Ashley' };

    render(<Appointment customer={customer} />, container)
    expect(container.textContent).toMatch(customer.firstName);
  });

  it('renders another customer first name', () => {
    customer = { firstName: 'Jourdan' };

    render(<Appointment customer={customer} />, container)
    expect(container.textContent).toMatch(customer.firstName);
  });
});


describe('AppointmentsDayView', function () {
  let container;

  beforeEach(() => {
    container = document.createElement('div');
  })

  it('renders the div with correct id', () => {
    const date = new Date();
    const appointments = [
      {startsAt: '12:00', customer: 'Ashley'},
      {startsAt: '13:00', customer: 'Jourdan'}
    ]

    render(<AppointmentsDayView appointments={[]} />, container)
    expect(container.querySelector('#appointmentsDayView')).not.toBeNull();
  });

  it('should renders appointments', () => {
    const date = new Date();
    const appointments = [
      {startsAt: '12:00', customer: 'Ashley'},
      {startsAt: '13:00', customer: 'Jourdan'}
    ]

    render(<AppointmentsDayView appointments={appointments} />, container)
    expect(container.querySelector('ol')).not.toBeNull();
    expect(container.querySelector('ol').children).toHaveLength(2);
  });

  it('should renders appointments in an li', () => {
    const date = new Date();
    const appointments = [
      {startsAt: date.setHours(12, 0)},
      {startsAt: date.setHours(13, 0)}
    ]

    render(<AppointmentsDayView appointments={appointments} />, container)
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelectorAll('li')[0].textContent)
      .toContain('12:00');
    expect(container.querySelectorAll('li')[1].textContent)
      .toContain('13:00');
  });
});
