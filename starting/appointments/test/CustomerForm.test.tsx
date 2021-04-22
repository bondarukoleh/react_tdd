import * as React from 'react';
import {createContainer} from './helpers/domManipulations';
import {CustomerForm} from '../src/components/CustomerForm';

describe('CustomerForm', () => {
  let render, container;
  const formId = 'customer';
  const firstNameId = 'firstName';
  const form = (elemId: string) => container.querySelector(`form[id="${elemId}"]`);
  const firstNameField = () => form(formId).elements.firstName;
  const surNameField = () => form(formId).elements.surName;
  const labelFor = (elemName: string) => container.querySelector(`label[for="${elemName}"]`);
  const expectToBeInputFieldOfTypeText = (element: Element) => {
    expect(element).not.toBeNull();
    expect(element.tagName).toEqual('INPUT');
    expect(element.getAttribute('type')).toEqual('text');
  };

  beforeEach(() => ({render, container} = createContainer()));

  it('renders a form', () => {
    render(<CustomerForm/>);
    expect(form(formId)).not.toBeNull();
  });

  it('renders the first name field as a text box', () => {
    render(<CustomerForm />);
    expectToBeInputFieldOfTypeText(firstNameField());
  });

  it('includes the existing value for the first name', () => {
    render(<CustomerForm firstName="Ashley" />);
    expect(firstNameField().value).toEqual('Ashley');
  });

  it('renders a label for the first name field', () => {
    render(<CustomerForm />);
    expect(labelFor(firstNameId)).not.toBeNull();
    expect(labelFor(firstNameId).textContent).toEqual('First name');
  });

  it('assigns an id that matches the label id to the first name field', () => {
    render(<CustomerForm />);
    expect(firstNameField().id).toEqual(firstNameId);
  });

  it('renders a label for the first name field', () => {
    render(<CustomerForm />);
    expect(labelFor(firstNameId).textContent).toEqual('First name');
  });
});
