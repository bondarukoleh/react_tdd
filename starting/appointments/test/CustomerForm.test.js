import React from 'react';
import {createContainer, withEvent} from './helpers/domManipulations';
import {CustomerForm} from '../src/components/CustomerForm';
import {fetchResponseOk, fetchResponseError, fetchRequestBodyOf} from '../src/helpers/spyHelpers';
import 'whatwg-fetch';

describe('CustomerForm', () => {
  let fetchSpy;
  let render, getFormField, labelFor, getForm, getElement, change, submit;
  const formId = 'customer';

  beforeEach(() => {
    ({
      render,
      getFormField,
      labelFor,
      render,
      getElement,
      getForm,
      change,
      submit
    } = createContainer());
    fetchSpy = jest.spyOn(window, 'fetch');
  });

  afterEach(() => window.fetch.mockRestore());

  it('renders a form', () => {
    render(<CustomerForm/>);
    expect(getForm(formId)).not.toBeNull();
  });

  it('has a submit button', () => {
    render(<CustomerForm/>);
    const submitButton = getElement('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  const itRendersAsATextBox = fieldName =>
    it('renders as a text box', () => {
      render(<CustomerForm/>);
      expectToBeInputFieldOfTypeText(getFormField({formId, name: fieldName}));
    });

  const itIncludesTheExistingValue = fieldName =>
    it('includes the existing value', () => {
      render(<CustomerForm {...{[fieldName]: 'value'}} />);
      expect(getFormField({formId, name: fieldName}).value).toEqual('value');
    });

  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      render(<CustomerForm/>);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

  const itAssignsAnIdThatMatchesTheLabelId = fieldName =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm/>);
      expect(getFormField({formId, name: fieldName}).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      fetchSpy.mockImplementationOnce(() => fetchResponseOk({[fieldName]: value}));
      render(
        <CustomerForm
          {...{[fieldName]: value}}
        />
      );
      await submit(getForm(formId));
      expect(fetchRequestBodyOf(fetchSpy)).toMatchObject({[fieldName]: value});
    });

  const itSubmitsNewValue = (fieldName, value) => {
    it('saves new value when submitted', async () => {
      fetchSpy.mockImplementationOnce(() => fetchResponseOk({[fieldName]: value}));

      render(
        <CustomerForm
          {...{[fieldName]: 'existingValue'}}
        />
      );
      change(getFormField({formId, name: fieldName}), withEvent(fieldName, value));
      await submit(getForm(formId));
      expect(fetchRequestBodyOf(fetchSpy)).toMatchObject({[fieldName]: value});
    });
  };

  describe('first name field', () => {
    itRendersAsATextBox('firstName');
    itIncludesTheExistingValue('firstName');
    itRendersALabel('firstName', 'First name');
    itAssignsAnIdThatMatchesTheLabelId('firstName');
    itSubmitsExistingValue('firstName', 'value');
    itSubmitsNewValue('firstName', 'newValue');
  });

  describe('last name field', () => {
    itRendersAsATextBox('lastName');
    itIncludesTheExistingValue('lastName');
    itRendersALabel('lastName', 'Last name');
    itAssignsAnIdThatMatchesTheLabelId('lastName');
    itSubmitsExistingValue('lastName', 'value');
    itSubmitsNewValue('lastName', 'newValue');
  });

  describe('phone number field', () => {
    itRendersAsATextBox('phoneNumber');
    itIncludesTheExistingValue('phoneNumber');
    itRendersALabel('phoneNumber', 'Phone number');
    itAssignsAnIdThatMatchesTheLabelId('phoneNumber');
    itSubmitsExistingValue('phoneNumber', '12345');
    itSubmitsNewValue('phoneNumber', '67890');
  });

  it('calls fetch with the right properties when submitting data', async () => {

    fetchSpy.mockImplementationOnce(() => fetchResponseOk({}));
    render(<CustomerForm/>);

    submit(getForm(formId));

    expect(fetchSpy).toHaveBeenCalledWith('/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      })
    );
  });

  it('prevents the default action when submitting the form', async () => {
    fetchSpy.mockImplementation(() => fetchResponseOk({}));
    render(<CustomerForm/>);

    submit(getForm(formId), withEvent('preventDefault', fetchSpy));
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = {firstName: 'Oleh'};
    fetchSpy.mockImplementationOnce(() => fetchResponseOk(customer));
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} {...customer} />);
    await submit(getForm(formId))
    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining(customer));
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    const saveSpy = jest.fn();
    fetchSpy.mockImplementationOnce(() => fetchResponseError());

    render(<CustomerForm onSave={saveSpy}/>);
    await submit(getForm(formId));
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    fetchSpy.mockImplementationOnce(() => fetchResponseError());
    render(<CustomerForm/>);
    await submit(getForm(formId));
    const errorElement = getElement('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occurred');
  });
});
