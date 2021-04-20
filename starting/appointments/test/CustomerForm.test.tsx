import * as React from 'react';
import { createContainer } from './helpers/domManipulations';
import { CustomerForm } from '../src/components/CustomerForm';


describe('CustomerForm', () => {
  let render, container;
  
  beforeEach(() => ({ render, container } = createContainer()));

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(container.querySelector('form[id="customer"]')).not.toBeNull();
  });
});
