import React from 'react';
import ReactDOM from 'react-dom';
import {Appointment} from '../src/Appointment';

describe('Appointment', function () {
  let container;
  let customer;
  const render = component => ReactDOM.render(component, container)

  beforeEach(() => {
    container = document.createElement('div');
  })

  it('renders the customer first name', () => {
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
