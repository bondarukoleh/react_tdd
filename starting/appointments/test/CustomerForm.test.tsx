import * as React from 'react';
import * as ReactTestUtils from 'react-dom/test-utils'
import {createContainer} from './helpers/domManipulations';
import {CustomerForm} from '../src/components/CustomerForm';

describe('CustomerForm', () => {
  let render, container;
  const formId = 'customer';

  const form = (elemId: string) => container.querySelector(`form[id="${elemId}"]`);
  const getFormField = (fieldName: string) => form(formId).elements[fieldName];
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

  const testValues = [
    {fieldName: 'firstName', labelValue: 'First name', inputValue: 'Bob', changedInputValue: 'John'},
    {fieldName: 'surName', labelValue: 'Sur name', inputValue: 'De Vadere', changedInputValue: 'Smith'},
    {fieldName: 'telephone', labelValue: 'Telephone', inputValue: '', changedInputValue: '+12345678'},
  ]

  for (const {fieldName, labelValue, changedInputValue, inputValue} of testValues) {
    describe(`First Name field`, () => {
      it(`"${fieldName}" renders as a text box`, () => {
        render(<CustomerForm />);
        expectToBeInputFieldOfTypeText(getFormField(fieldName));
      });
      it(`includes the existing value for the "${fieldName}" field`, () => {
        render(<CustomerForm {...{[fieldName]: inputValue}}/>);
        expect(getFormField(fieldName).value).toEqual(inputValue);
      });
      it(`renders a label for the "${fieldName}" field`, () => {
        render(<CustomerForm/>);
        expect(labelFor(fieldName)).not.toBeNull();
        expect(labelFor(fieldName).textContent).toEqual(labelValue);
      });
      it(`assigns an id that matches the label id to the "${fieldName}" field`, () => {
        render(<CustomerForm />);
        expect(getFormField(fieldName).id).toEqual(fieldName);
      });
      it(`saves existing "${fieldName}" when submitted`, async () => {
        render(
          <CustomerForm
            {...{[fieldName]: inputValue}}
            submitted={(formData) => {expect(formData[fieldName]).toEqual(inputValue)}
            }
          />
        );
        ReactTestUtils.Simulate.submit(form(formId));
      })
      it(`saves changed "${fieldName}" when submitted`, async () => {
        render(
          <CustomerForm
            {...{[fieldName]: inputValue}}
            submitted={(formData) => {expect(formData[fieldName]).toEqual(changedInputValue)}}
          />
        );

        ReactTestUtils.Simulate.change(getFormField(fieldName), {
          target: {value: changedInputValue} as unknown as EventTarget
        });
        ReactTestUtils.Simulate.submit(form(formId));
      })
    })
  }

  it('has a submit button', () => {
    render(<CustomerForm />);
    const submitButton = container.querySelector('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });
})
