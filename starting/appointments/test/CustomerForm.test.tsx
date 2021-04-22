import * as React from 'react';
import {createContainer} from './helpers/domManipulations';
import {CustomerForm} from '../src/components/CustomerForm';

describe('CustomerForm', () => {
  let render, container;
  const findFormById = id => container.querySelector(`form[id="${id}"]`);
  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  beforeEach(() => ({render, container} = createContainer()));

  it('renders a form', () => {
    render(<CustomerForm/>);
    expect(findFormById('customer')).not.toBeNull();
  });

  it('renders the first name field as a text box', () => {
    render(<CustomerForm />);

    const field = findFormById('customer').elements.firstName;
    expectToBeInputFieldOfTypeText(field);
  });

  it('includes the existing value for the first name', () => {
    render(<CustomerForm firstName="Ashley" />);
    const field = findFormById('customer').elements.firstName;
    expect(field.value).toEqual('Ashley');
  });
});
