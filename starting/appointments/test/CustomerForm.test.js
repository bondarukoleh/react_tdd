import React from 'react';
import {createContainer, withEvent} from './helpers/domManipulations';
import {CustomerForm} from '../src/components/CustomerForm';
import {fetchResponseOk, fetchResponseError, fetchRequestBodyOf} from './helpers/spyHelpers';
import 'whatwg-fetch';
import * as ReactTestUtils from "react-dom/test-utils";
import {act} from "react-dom/test-utils";

describe('CustomerForm', () => {
  const validCustomer = {
    firstName: 'first',
    lastName: 'last',
    phoneNumber: '123456789'
  };
  let fetchSpy;
  let render, getFormField, labelFor, getForm, getElement, change, submit, blur;
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
      submit,
      blur
    } = createContainer());
    fetchSpy = jest.spyOn(window, 'fetch');
  });

  afterEach(() => window.fetch.mockRestore());

  it('renders a form', () => {
    render(<CustomerForm {...validCustomer} />);
    expect(getForm(formId)).not.toBeNull();
  });

  it('has a submit button', () => {
    render(<CustomerForm {...validCustomer} />);
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
      render(<CustomerForm {...validCustomer} />);
      expectToBeInputFieldOfTypeText(getFormField({formId, name: fieldName}));
    });

  const itIncludesTheExistingValue = fieldName =>
    it('includes the existing value', () => {
      render(<CustomerForm {...validCustomer} {...{[fieldName]: 'value'}} />);
      expect(getFormField({formId, name: fieldName}).value).toEqual('value');
    });

  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

  const itAssignsAnIdThatMatchesTheLabelId = fieldName =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm {...validCustomer} />);
      expect(getFormField({formId, name: fieldName}).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      fetchSpy.mockImplementationOnce(() => fetchResponseOk({[fieldName]: value}));
      render(
        <CustomerForm
          {...validCustomer}
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
          {...validCustomer}
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
    render(<CustomerForm {...validCustomer} />);

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
    render(<CustomerForm {...validCustomer} />);

    submit(getForm(formId), withEvent('preventDefault', fetchSpy));
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = {firstName: 'Oleh'};
    fetchSpy.mockImplementationOnce(() => fetchResponseOk(customer));
    const saveSpy = jest.fn();
    render(<CustomerForm {...validCustomer}  onSave={saveSpy} {...customer} />);
    await submit(getForm(formId))
    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining(customer));
  });

  it('does not notify onSave if the POST request returns an error', async () => {
    const saveSpy = jest.fn();
    fetchSpy.mockImplementationOnce(() => fetchResponseError());

    render(<CustomerForm {...validCustomer} onSave={saveSpy}/>);
    await submit(getForm(formId));
    expect(saveSpy).not.toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    fetchSpy.mockImplementationOnce(() => fetchResponseError());
    render(<CustomerForm {...validCustomer} />);
    await submit(getForm(formId));
    const errorElement = getElement('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occurred');
  });

  it('state is cleared when the form is submitted again', async () => {
    const customer = {firstName: 'Oleh'};

    fetchSpy.mockImplementationOnce(() => fetchResponseError());
    render(<CustomerForm {...validCustomer} />);
    await submit(getForm(formId));
    const errorElement = getElement('.error');
    expect(errorElement).not.toBeNull();

    fetchSpy.mockImplementationOnce(() => fetchResponseOk(customer));
    await submit(getForm(formId));
    expect(getElement('.error')).toBeNull();
  });

  it('displays error after blur when first name field is blank', async () => {
    render(<CustomerForm {...validCustomer} />);
    blur(getFormField({formId: 'customer', name: 'firstName'}), withEvent('firstName', ' '));
    expect(getElement('.error')).not.toBeNull();
    expect(getElement('.error').textContent).toMatch('First name is required');
  });

  it('does not submit the form when there are validation errors', async () => {
      render(<CustomerForm />);
      await submit(getForm('customer'));
      expect(fetchSpy).not.toHaveBeenCalled();
    });

  it('renders validation errors after submission fails', async () => {
    render(<CustomerForm />);
    await submit(getForm('customer'));
    expect(fetchSpy).not.toHaveBeenCalled();
    expect(getElement('.error')).not.toBeNull();
  });

  it('renders field validation errors from server', async () => {
    const errors = {
      phoneNumber: 'Phone number already exists in the system'
    };
    fetchSpy.mockReturnValue(fetchResponseError(422, {errors}));
    render(<CustomerForm {...validCustomer} />);
    await submit(getForm('customer'));
    expect(getElement('.error').textContent).toMatch(errors.phoneNumber);
  });

  describe('validation', () => {
    const itInvalidatesFieldWithValue = (
      fieldName,
      value,
      description
    ) => {
      it(`displays error after blur when ${fieldName} field is '${value}'`, () => {
        render(<CustomerForm {...validCustomer} />);

        blur(getFormField({formId: 'customer', name: fieldName}), withEvent(fieldName, value));

        expect(getElement('.error')).not.toBeNull();
        expect(getElement('.error').textContent).toMatch(description);
      });
    };

    itInvalidatesFieldWithValue(
      'firstName',
      ' ',
      'First name is required'
    );
    itInvalidatesFieldWithValue(
      'lastName',
      ' ',
      'Last name is required'
    );
    itInvalidatesFieldWithValue(
      'phoneNumber',
      ' ',
      'Phone number is required'
    );
    itInvalidatesFieldWithValue(
      'phoneNumber',
      'invalid',
      'Only numbers, spaces and these symbols are allowed: ( ) + -'
    );

    it('accepts standard phone number characters when validating', () => {
      render(<CustomerForm {...validCustomer} />);

      blur(
        getFormField({formId: 'customer', name: 'phoneNumber'}),
        withEvent('phoneNumber', '0123456789+()- ')
      );

      expect(getElement('.error')).toBeNull();
    });
  });

  it('displays indicator when form is submitting', async () => {
    render(<CustomerForm {...validCustomer} />);
    /* We need sync act here to not wait for the submit to finish, to get the submitting loader (indicator) */
    act(() => {
      ReactTestUtils.Simulate.submit(getForm('customer'));
    });
    await act(async() => {
      expect(getElement('.submittingIndicator')).not.toBeNull();
    });
  });

  it('initially does not display the submitting indicator', () => {
    render(<CustomerForm {...validCustomer} />);
    expect(getElement('.submittingIndicator')).toBeNull();
  });

  it('hides indicator when form has submitted', async () => {
    render(<CustomerForm {...validCustomer} />);
    fetchSpy.mockReturnValue(fetchResponseOk());
    await submit(getForm('customer'));
    expect(getElement('.submittingIndicator')).toBeNull();
  });

  it('submit button disabled when form submitting', async () => {
    render(<CustomerForm {...validCustomer} />);
    act(() => {
      ReactTestUtils.Simulate.submit(getForm('customer'));
    });
    await act(async() => {
      expect(getElement('input[type="submit"]').disabled).toEqual(true)
    });
  });
});
