import React from 'react';
import {
  createShallowRenderer,
  predicateByType,
  predicateByClassName,
  predicateById,
  click,
  childrenOf
} from './helpers/shallowHelpers';
import {App} from '../src/App';
import {AppointmentsDayViewLoader} from '../src/containers/AppointmentsDayViewLoader';
import {AppointmentFormLoader} from '../src/containers/AppointmentFormLoader';
import {CustomerForm} from '../src/components/CustomerForm';

describe('App', () => {
  let render, elementMatching, child, elementsMatching;
  beforeEach(() => {
    ({render, elementMatching, elementsMatching, child} = createShallowRenderer());
  });
  const clickAddCustomer = () => click(elementMatching(predicateById('addCustomer')));
  const saveCustomer = customer => elementMatching(predicateByType(CustomerForm)).props.onSave(customer);
  const submitAppointment = () => elementMatching(predicateByType(AppointmentFormLoader)).props.onSubmit();

  it('initially shows the AppointmentDayViewLoader', () => {
    render(<App/>);
    expect(elementMatching(predicateByType(AppointmentsDayViewLoader))).toBeDefined();
  });

  it('has a button bar as the first child', () => {
    render(<App/>);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });

  it('has a button to initiate add customer and appointment action', () => {
    render(<App/>);
    const buttons = childrenOf(elementMatching(predicateByClassName('button-bar')));
    expect(buttons[0].type).toEqual('button');
    expect(buttons[0].props.children).toEqual('Add customer and appointment');
  });

  it('displays the CustomerForm when button is clicked', async () => {
    render(<App/>);
    clickAddCustomer();
    expect(elementMatching(predicateByType(CustomerForm))).toBeDefined();
  });

  it('hides the AppointmentDayViewLoader when button is clicked', async () => {
    render(<App/>);
    clickAddCustomer();
    expect(elementMatching(predicateByType(AppointmentsDayViewLoader))).not.toBeDefined();
  });

  it('hides the button bar when CustomerForm is being displayed', async () => {
    render(<App/>);
    clickAddCustomer();
    expect(elementMatching(predicateByClassName('button-bar'))).not.toBeDefined();
  });

  it('displays the AppointmentFormLoader after the CustomerForm is submitted', async () => {
    render(<App/>);
    clickAddCustomer();
    saveCustomer();
    expect(elementMatching(predicateByType(AppointmentFormLoader))).toBeDefined();
  });

  it('passes the customer to the AppointmentForm', async () => {
    render(<App/>);
    const customer = {id: 123};
    clickAddCustomer();
    saveCustomer(customer);
    expect(elementMatching(predicateByType(AppointmentFormLoader)).props.customer).toBe(customer);
  });

  it('renders AppointmentDayViewLoader after AppointmentForm is submitted', async () => {
    render(<App/>);
    clickAddCustomer();
    saveCustomer();
    submitAppointment();
    expect(elementMatching(predicateByType(AppointmentsDayViewLoader))).toBeDefined();
  });
});
