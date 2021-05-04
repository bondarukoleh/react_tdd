import React from 'react';
import ReactTestUtils, {act} from 'react-dom/test-utils';
import { createContainer } from './helpers/domManipulations';
import { CustomerForm } from '../src/components/CustomerForm';
import {fetchResponseOk, fetchResponseError, fetchRequestBodyOf} from '../src/helpers/spyHelpers'

describe('CustomerForm', () => {
  let render, container;
  const originalFetch = window.fetch;
  let fetchSpy;

  beforeEach(() => {
    ({ render, container } = createContainer());
    fetchSpy = jest.fn();
    window.fetch = fetchSpy;
  });

  afterEach(() => {
    window.fetch = originalFetch;
  });

  const form = id => container.querySelector(`form[id="${id}"]`);
  const field = name => form('customer').elements[name];
  const labelFor = formElement => container.querySelector(`label[for="${formElement}"]`);

  it('renders a form', () => {
    render(<CustomerForm />);
    expect(form('customer')).not.toBeNull();
  });

  it('has a submit button', () => {
    render(<CustomerForm />);
    const submitButton = container.querySelector(
      'input[type="submit"]'
    );
    expect(submitButton).not.toBeNull();
  });

  const expectToBeInputFieldOfTypeText = formElement => {
    expect(formElement).not.toBeNull();
    expect(formElement.tagName).toEqual('INPUT');
    expect(formElement.type).toEqual('text');
  };

  const itRendersAsATextBox = fieldName =>
    it('renders as a text box', () => {
      render(<CustomerForm />);
      expectToBeInputFieldOfTypeText(field(fieldName));
    });

  const itIncludesTheExistingValue = fieldName =>
    it('includes the existing value', () => {
      render(<CustomerForm {...{ [fieldName]: 'value' }} />);
      expect(field(fieldName).value).toEqual('value');
    });

  const itRendersALabel = (fieldName, text) =>
    it('renders a label', () => {
      render(<CustomerForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });

  const itAssignsAnIdThatMatchesTheLabelId = fieldName =>
    it('assigns an id that matches the label id', () => {
      render(<CustomerForm />);
      expect(field(fieldName).id).toEqual(fieldName);
    });

  const itSubmitsExistingValue = (fieldName, value) =>
    it('saves existing value when submitted', async () => {
      fetchSpy.mockImplementationOnce(() => fetchResponseOk({ [fieldName]: value }))
      render(
        <CustomerForm
          {...{ [fieldName]: value }}
        />
      );
      await act(async () => ReactTestUtils.Simulate.submit(form('customer')));
      expect(fetchRequestBodyOf(fetchSpy)).toMatchObject({[fieldName]: value})
    });

  const itSubmitsNewValue = (fieldName, value) => {
    it('saves new value when submitted', async () => {
      fetchSpy.mockImplementationOnce(() => fetchResponseOk({ [fieldName]: value }))

      render(
        <CustomerForm
          {...{ [fieldName]: 'existingValue' }}
        />
      );
      await act(async () => {
        ReactTestUtils.Simulate.change(field(fieldName), {target: { value, name: fieldName }})
      });
      await act(async () => ReactTestUtils.Simulate.submit(form('customer')));
      expect(fetchRequestBodyOf(fetchSpy)).toMatchObject({[fieldName]: value})
    });
  }

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

    fetchSpy.mockImplementationOnce(() => fetchResponseOk({}))
    render(<CustomerForm />);

    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });

    expect(fetchSpy).toHaveBeenCalledWith('/customers',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      })
    );
  });

  it('prevents the default action when submitting the form', async () => {
    fetchSpy.mockImplementation(() => fetchResponseOk({}))
    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'), {
        preventDefault: fetchSpy
      });
    });
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('notifies onSave when form is submitted', async () => {
    const customer = { firstName: 'Oleh' };
    fetchSpy.mockImplementationOnce(() => fetchResponseOk(customer))
    const saveSpy = jest.fn();
    render(<CustomerForm onSave={saveSpy} {...customer} />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });
    expect(saveSpy).toHaveBeenCalled();
    expect(saveSpy).toHaveBeenCalledWith(expect.objectContaining(customer));
  });

  it('does not notify onSave if the POST request returns an error', async () => {
      const saveSpy = jest.fn();
    fetchSpy.mockImplementationOnce(() => fetchResponseError())

      render(<CustomerForm onSave={saveSpy} />);
      await act(async () => {
        ReactTestUtils.Simulate.submit(form('customer'));
      });
      expect(saveSpy).not.toHaveBeenCalled();
    });

  it('renders error message when fetch call fails', async () => {
    fetchSpy.mockImplementationOnce(() => fetchResponseError())
    render(<CustomerForm />);
    await act(async () => {
      ReactTestUtils.Simulate.submit(form('customer'));
    });
    const errorElement = container.querySelector('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occurred');
  });
});
