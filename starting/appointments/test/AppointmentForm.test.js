import React from 'react';
import {createContainerWithStore, withEvent} from './helpers/domManipulations';
import {fetchResponseOk, fetchResponseError, fetchRequestBodyOf } from './helpers/spyHelpers';
import {AppointmentForm} from '../src/components/AppointmentForm';
import 'whatwg-fetch';
import {Actions} from "../src/sagas/constans";

describe('AppointmentForm', () => {
  let renderWithStore, store, getFormField, labelFor, startsAtField, getForm, getElement, change, submit, fetchSpy, asyncRender;
  const formId = 'appointment';
  const customer = { id: 123 };

  beforeEach(() => {
    ({
      renderWithStore,
      store,
      getFormField,
      labelFor,
      startsAtField,
      getForm,
      getElement,
      change,
      submit,
      asyncRender,
    } = createContainerWithStore());
    fetchSpy = jest.spyOn(window, 'fetch');
  });

  const findOption = (dropdownNode, textContent) => {
    const options = Array.from(dropdownNode.childNodes);
    return options.find(option => option.textContent === textContent);
  };
  const timeSlotTable = () => getElement('table#time-slots');
  const today = new Date();
  const availableTimeSlots = [
    { startsAt: today.setHours(9, 0, 0, 0) },
    { startsAt: today.setHours(9, 30, 0, 0) }
  ];

  it('renders a form', () => {
    renderWithStore(<AppointmentForm />);
    expect(getForm(formId)).not.toBeNull();
  });

  it('has a submit button', () => {
    renderWithStore(<AppointmentForm />);
    const submitButton = getElement('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  const itRendersAsASelectBox = fieldName => {
    it('renders as a select box', () => {
      renderWithStore(<AppointmentForm />);
      expect(getFormField({formId, name: fieldName})).not.toBeNull();
      expect(getFormField({formId, name: fieldName}).tagName).toEqual('SELECT');
    });
  };

  const itInitiallyHasABlankValueChosen = fieldName => {
    it('initially has a blank value chosen', () => {
      renderWithStore(<AppointmentForm />);
      const firstNode = getFormField({formId, name: fieldName}).childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    })
  };

  const itPreselectsExistingValue = (fieldName, props, existingValue) => {
    it('pre-selects the existing value', () => {
      renderWithStore(
        <AppointmentForm
          {...props}
          {...{ [fieldName]: existingValue }}
        />
      );
      const option = findOption(getFormField({formId, name: fieldName}), existingValue);
      expect(option.selected).toBeTruthy();
    });
  };

  const itRendersALabel = (fieldName, text) => {
    it('renders a label', () => {
      renderWithStore(<AppointmentForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = fieldName => {
    it('assigns an id that matches the label id', () => {
      renderWithStore(<AppointmentForm />);
      expect(getFormField({formId, name: fieldName}).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (fieldName, {value}) => {
    it('saves existing value when submitted', async () => {
      const submitSpy = jest.fn();
      fetchSpy.mockImplementationOnce(() => fetchResponseOk())
      renderWithStore(
        <AppointmentForm
          {...{ [fieldName]: value}}
          customer={customer}
          onSubmit={submitSpy}
        />
      );
      await submit(getForm(formId));
      expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({[fieldName]: value}))
    });
  };

  const itSubmitsNewValue = (fieldName, {existingValue, newValue}) => {
    it('saves new value when submitted', async () => {
      const submitSpy = jest.fn();
      fetchSpy.mockImplementationOnce(() => fetchResponseOk())
      renderWithStore(
        <AppointmentForm
          {...{ [fieldName]: existingValue }}
          customer={customer}
          onSubmit={submitSpy}
        />
      );
      change(getFormField({formId, name: fieldName}), withEvent(fieldName, newValue));
      await submit(getForm(formId));
      expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({[fieldName]: newValue}))
    });
  };

  describe('service field', () => {
    itRendersAsASelectBox('service');
    itInitiallyHasABlankValueChosen('service');
    itPreselectsExistingValue(
      'service',
      { selectableServices: ['Cut', 'Blow-dry'] },
      'Blow-dry'
    );
    itRendersALabel('service', 'Salon service');
    itAssignsAnIdThatMatchesTheLabelId('service');
    itSubmitsExistingValue('service', {value: 'Cut'});
    itSubmitsNewValue('service', {
      serviceStylists: { newValue: [], existingValue: [] }
    });

    it('lists all salon services', () => {
      const selectableServices = ['Cut', 'Blow-dry'];

      renderWithStore(
        <AppointmentForm selectableServices={selectableServices} />
      );

      const optionNodes = Array.from(getFormField({formId, name: 'service'}).childNodes);
      const renderedServices = optionNodes.map(node => node.textContent);
      expect(renderedServices).toEqual(expect.arrayContaining(selectableServices));
    });
  });

  describe('stylist field', () => {
    itRendersAsASelectBox('stylist');
    itInitiallyHasABlankValueChosen('stylist');
    itPreselectsExistingValue(
      'stylist',
      { selectableStylists: ['Ashley', 'Jo'] },
      'Ashley'
    );
    itRendersALabel('stylist', 'Stylist');
    itAssignsAnIdThatMatchesTheLabelId('stylist');
    itSubmitsExistingValue('stylist', {value: 'Ashley'});
    itSubmitsNewValue('stylist', {existingValue: 'Ashley', newValue: 'Pat'});

    it('lists only stylists that can perform the selected service', () => {
      const selectableServices = ['1', '2'];
      const selectableStylists = ['A', 'B', 'C'];
      const serviceStylists = {
        '1': ['A', 'B']
      };

      renderWithStore(
        <AppointmentForm
          selectableServices={selectableServices}
          selectableStylists={selectableStylists}
          serviceStylists={serviceStylists}
        />
      );

      change(getFormField({formId, name: 'service'}), withEvent('service', '1'));

      const optionNodes = Array.from(getFormField({formId, name: 'stylist'}).childNodes);
      const renderedServices = optionNodes.map(
        node => node.textContent
      );
      expect(renderedServices).toEqual(
        expect.arrayContaining(['A', 'B'])
      );
    });
  });

  describe('time slot table', () => {
    it('renders a table for time slots', () => {
      renderWithStore(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull();
    });

    it('renders a time slot for every half an hour between open and close times', () => {
      renderWithStore(
        <AppointmentForm salonOpensAt={9} salonClosesAt={11} />
      );
      const timesOfDay = timeSlotTable().querySelectorAll(
        'tbody >* th'
      );
      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual('09:00');
      expect(timesOfDay[1].textContent).toEqual('09:30');
      expect(timesOfDay[3].textContent).toEqual('10:30');
    });

    it('renders an empty cell at the start of the header row', () => {
      renderWithStore(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector(
        'thead > tr'
      );
      expect(headerRow.firstChild.textContent).toEqual('');
    });

    it('renders a week of available dates', () => {
      const today = new Date(2018, 11, 1);
      renderWithStore(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        'thead >* th:not(:first-child)'
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });

    it('renders a radio button for each time slot', () => {
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      const cells = timeSlotTable().querySelectorAll('td');
      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull();
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).not.toBeNull();
    });

    it('does not render radio buttons for unavailable time slots', () => {
      renderWithStore(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });

    it('sets radio button values to the startsAt value of the corresponding appointment', () => {
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      expect(startsAtField(0).value).toEqual(
        availableTimeSlots[0].startsAt.toString()
      );
      expect(startsAtField(1).value).toEqual(
        availableTimeSlots[1].startsAt.toString()
      );
    });

    it('pre-selects the existing value', () => {
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
        />
      );
      expect(startsAtField(0).checked).toEqual(true);
    });

    it('saves existing value when submitted', async () => {
      const submitSpy = jest.fn();
      fetchSpy.mockImplementationOnce(() => fetchResponseOk())
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={submitSpy}
          customer={customer}
        />
      );
      await submit(getForm(formId));
      expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({startsAt: availableTimeSlots[0].startsAt}))
    });

    it('saves new value when submitted', async () => {
      const submitSpy = jest.fn();
      fetchSpy.mockImplementationOnce(() => fetchResponseOk())
      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={submitSpy}
          customer={customer}
        />
      );
      change(startsAtField(1), withEvent('startsAt', availableTimeSlots[1].startsAt.toString()));
      await submit(getForm(formId));
      expect(submitSpy).toHaveBeenCalledWith(expect.objectContaining({startsAt: availableTimeSlots[1].startsAt}))
    });

    it('filters appointments by selected stylist', () => {
      const availableTimeSlots = [
        {
          startsAt: today.setHours(9, 0, 0, 0),
          stylists: ['A', 'B']
        },
        {
          startsAt: today.setHours(9, 30, 0, 0),
          stylists: ['A']
        }
      ];

      renderWithStore(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          customer={customer}
        />
      );

      change(getFormField({formId, name: 'stylist'}), withEvent('stylist', 'B'));

      const cells = timeSlotTable().querySelectorAll('td');
      expect(
        cells[0].querySelector('input[type="radio"]')
      ).not.toBeNull();
      expect(
        cells[7].querySelector('input[type="radio"]')
      ).toBeNull();
    });
  });

  it('calls fetch with the right properties when submitting data', async () => {
    renderWithStore(<AppointmentForm availableTimeSlots={availableTimeSlots}/>);
    change(startsAtField(1), withEvent('startsAt', availableTimeSlots[1].startsAt.toString()));
    await submit(getForm(formId));

    expect(fetchSpy).toHaveBeenLastCalledWith('/appointments',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
      })
    );
  });

  it('prevents the default action when submitting the form', async () => {
    fetchSpy.mockImplementation(() => fetchResponseOk({}));
    renderWithStore(
      <AppointmentForm
        availableTimeSlots={availableTimeSlots}
        today={today}
        startsAt={availableTimeSlots[0].startsAt}
        onSubmit={() => {}}
        customer={customer}
      />
    );

    submit(getForm(formId), withEvent('preventDefault', fetchSpy));
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('notifies onSubmit when form is submitted', async () => {
    fetchSpy.mockImplementationOnce(() => fetchResponseOk({}));
    const onSubmitSpy = jest.fn();

    renderWithStore(<AppointmentForm onSubmit={onSubmitSpy} customer={customer}/>);
    await submit(getForm(formId));

    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    fetchSpy.mockImplementationOnce(() => fetchResponseError());
    renderWithStore(<AppointmentForm customer={customer}/>);
    await submit(getForm(formId));
    const errorElement = getElement('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occurred');
  });

  it('state is cleared when the form is submitted again', async () => {
    fetchSpy.mockImplementationOnce(() => fetchResponseError());
    renderWithStore(<AppointmentForm  onSubmit={() => {}} customer={customer}/>);
    await submit(getForm(formId));
    const errorElement = getElement('.error');
    expect(errorElement).not.toBeNull();

    fetchSpy.mockImplementationOnce(() => fetchResponseOk({}));
    await submit(getForm(formId));
    expect(getElement('.error')).toBeNull();
  });

  it('passes the customer id to fetch when submitting', async () => {
    renderWithStore(<AppointmentForm />);
    fetchSpy.mockReset();
    store.dispatch({
      type: Actions.SET_CUSTOMER_FOR_APPOINTMENT,
      customer
    })
    await submit(getForm(formId));
    expect(fetchRequestBodyOf(fetchSpy)).toMatchObject({customer: customer.id});
  });
});
