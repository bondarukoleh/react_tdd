import * as React from 'react';
import * as ReactTestUtils from 'react-dom/test-utils';
import {render} from 'react-dom';
import {Appointment} from '../src/components/Appointment';
import {AppointmentsDayView} from '../src/components/AppointmentsDayView';
import {makeId} from "../src/helpers/general";

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
  const appointments = [
    {startsAt: new Date().setHours(12, 0), customer: {firstName: 'Ashley'}, id: makeId()},
    {startsAt: new Date().setHours(13, 0), customer: {firstName: 'Jourdan'}, id: makeId()}
  ]

  beforeEach(() => {
    container = document.createElement('div');
  })

  it('renders the div with correct id', () => {
    render(<AppointmentsDayView appointments={[]} />, container)
    expect(container.querySelector('#appointmentsDayView')).not.toBeNull();
  });

  it('initially shows a message saying there are no appointments today', () => {
  render(<AppointmentsDayView appointments={[]} />, container);
  expect(container.textContent).toMatch(
    'There are no appointments scheduled for today.'
  );
});

  it('selects the first appointment by default', () => {
    render(<AppointmentsDayView appointments={appointments} />, container);
    expect(container.querySelector('#appointmentView').textContent).toMatch(appointments[0].customer.firstName);
  });

  it('should renders appointments', () => {
    render(<AppointmentsDayView appointments={appointments} />, container)
    expect(container.querySelector('ol')).not.toBeNull();
    expect(container.querySelector('ol').children).toHaveLength(2);
  });

  it('should renders appointments in an li', () => {
    render(<AppointmentsDayView appointments={appointments} />, container)
    expect(container.querySelectorAll('li')).toHaveLength(2);
    expect(container.querySelectorAll('li')[0].textContent)
      .toContain('12:00');
    expect(container.querySelectorAll('li')[1].textContent)
      .toContain('13:00');
  });

  it('has a button element in each li', () => {
    render(<AppointmentsDayView appointments={appointments} />, container);
    expect(
      container.querySelectorAll('li > button')
    ).toHaveLength(2);
    expect(
      container.querySelectorAll('li > button')[0].type
    ).toEqual('button');
  });

  it('click on appointment shows corresponded one', () => {
    render(<AppointmentsDayView appointments={appointments} />, container);
    const button = container.querySelector('#appointmentsDayView').querySelectorAll('button')[1];
    ReactTestUtils.Simulate.click(button);
    expect(container.querySelector('#appointmentView').innerHTML).toMatch(appointments[1].customer.firstName);
  });
});
