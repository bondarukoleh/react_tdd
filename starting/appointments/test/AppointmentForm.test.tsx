import * as React from 'react';
import {createContainer} from './helpers/domManipulations';
import {AppointmentForm} from '../src/components/AppointmentForm';

describe('AppointmentForm', () => {
  let render, container;
  beforeEach(() => ({render, container} = createContainer()));
  const form = (id: string) => container.querySelector(`form[id="${id}"]`);
  const field = name => form('appointment').elements[name];

  it('should render', function () {
    render(<AppointmentForm/>);
    expect(form('appointment')).not.toBeNull();
  });

  describe('service field', () => {
    it('renders as a select box', () => {
      render(<AppointmentForm />);
      expect(field('service')).not.toBeNull();
      expect(field('service').tagName).toEqual('SELECT');
    });

    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />);
      const firstNode = field('service').childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });

    it.only('lists all salon services', () => {
      const selectableServices = ['Cut', 'Blow-dry'];
      render(<AppointmentForm selectableServices={selectableServices}/>);
      const optionNodes = Array.from(field('service').childNodes) as [{textContent: string}];
      const renderedServices = optionNodes.map(node => node.textContent);
      expect(renderedServices).toEqual(expect.arrayContaining(selectableServices));
    });
  });
});
