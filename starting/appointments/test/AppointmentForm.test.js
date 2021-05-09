import React from 'react';
import ReactTestUtils from 'react-dom/test-utils';
import { createContainer, withEvent } from './helpers/domManipulations';
import {fetchResponseOk, fetchResponseError, fetchRequestBodyOf } from './helpers/spyHelpers';
import { AppointmentForm } from '../src/components/AppointmentForm';
import 'whatwg-fetch';

describe('AppointmentForm', () => {
  let render, getFormField, labelFor, startsAtField, getForm, getElement, change, submit, fetchSpy;
  const formId = 'appointment';

  beforeEach(() => {
    ({render,
      getFormField,
      labelFor,
      startsAtField,
      render,
      getForm,
      getElement,
      change,
      submit
    } = createContainer());
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
    render(<AppointmentForm />);
    expect(getForm(formId)).not.toBeNull();
  });

  it('has a submit button', () => {
    render(<AppointmentForm />);
    const submitButton = getElement('input[type="submit"]');
    expect(submitButton).not.toBeNull();
  });

  const itRendersAsASelectBox = fieldName => {
    it('renders as a select box', () => {
      render(<AppointmentForm />);
      expect(getFormField({formId, name: fieldName})).not.toBeNull();
      expect(getFormField({formId, name: fieldName}).tagName).toEqual('SELECT');
    });
  };

  const itInitiallyHasABlankValueChosen = fieldName =>
    it('initially has a blank value chosen', () => {
      render(<AppointmentForm />);
      const firstNode = getFormField({formId, name: fieldName}).childNodes[0];
      expect(firstNode.value).toEqual('');
      expect(firstNode.selected).toBeTruthy();
    });

  const itPreselectsExistingValue = (fieldName, props, existingValue) => {
    it('pre-selects the existing value', () => {
      render(
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
      render(<AppointmentForm />);
      expect(labelFor(fieldName)).not.toBeNull();
      expect(labelFor(fieldName).textContent).toEqual(text);
    });
  };

  const itAssignsAnIdThatMatchesTheLabelId = fieldName => {
    it('assigns an id that matches the label id', () => {
      render(<AppointmentForm />);
      expect(getFormField({formId, name: fieldName}).id).toEqual(fieldName);
    });
  };

  const itSubmitsExistingValue = (fieldName, {value}) => {
    it('saves existing value when submitted', async () => {
      render(
        <AppointmentForm
          {...{ [fieldName]: value}}
          onSubmit={props => {
            expect(props[fieldName]).toEqual(value)
            }
          }
        />
      );
      await submit(getForm(formId));
      expect.hasAssertions();
    });
  };

  const itSubmitsNewValue = (fieldName, {existingValue, newValue}) => {
    it('saves new value when submitted', async () => {
      render(
        <AppointmentForm
          {...{ [fieldName]: existingValue }}
          onSubmit={props =>
            expect(props[fieldName]).toEqual(newValue)
          }
        />
      );
      change(getFormField({formId, name: fieldName}), withEvent(fieldName, newValue));
      await submit(getForm(formId));
      expect.hasAssertions();
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

      render(
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

      render(
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
      render(<AppointmentForm />);
      expect(timeSlotTable()).not.toBeNull();
    });

    it('renders a time slot for every half an hour between open and close times', () => {
      render(
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
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector(
        'thead > tr'
      );
      expect(headerRow.firstChild.textContent).toEqual('');
    });

    it('renders a week of available dates', () => {
      const today = new Date(2018, 11, 1);
      render(<AppointmentForm today={today} />);
      const dates = timeSlotTable().querySelectorAll(
        'thead >* th:not(:first-child)'
      );
      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Sat 01');
      expect(dates[1].textContent).toEqual('Sun 02');
      expect(dates[6].textContent).toEqual('Fri 07');
    });

    it('renders a radio button for each time slot', () => {
      render(
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
      render(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });

    it('sets radio button values to the startsAt value of the corresponding appointment', () => {
      render(
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
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
        />
      );
      expect(startsAtField(0).checked).toEqual(true);
    });

    it('saves existing value when submitted', async () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={({ startsAt }) =>
            expect(startsAt).toEqual(
              availableTimeSlots[0].startsAt
            )
          }
        />
      );
      submit(getForm(formId));
    });

    it('saves new value when submitted', () => {
      expect.hasAssertions();
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
          startsAt={availableTimeSlots[0].startsAt}
          onSubmit={({ startsAt }) =>
            expect(startsAt).toEqual(
              availableTimeSlots[1].startsAt
            )
          }
        />
      );
      change(startsAtField(1), withEvent('startsAt', availableTimeSlots[1].startsAt.toString()));
      submit(getForm(formId));
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

      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
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
    render(
      <AppointmentForm
        availableTimeSlots={availableTimeSlots}
        today={today}
        startsAt={availableTimeSlots[0].startsAt}
        onSubmit={() => {}}
      />
    );
    change(startsAtField(1), withEvent('startsAt', availableTimeSlots[1].startsAt.toString()));
    submit(getForm(formId));

    expect(fetchSpy).lastCalledWith('/appointments',
      expect.objectContaining({
        method: 'POST',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({"startsAt": availableTimeSlots[1].startsAt})
      })
    );
  });

  it('prevents the default action when submitting the form', async () => {
    fetchSpy.mockImplementation(() => fetchResponseOk({}));
    render(
      <AppointmentForm
        availableTimeSlots={availableTimeSlots}
        today={today}
        startsAt={availableTimeSlots[0].startsAt}
        onSubmit={() => {}}
      />
    );

    submit(getForm(formId), withEvent('preventDefault', fetchSpy));
    expect(fetchSpy).toHaveBeenCalled();
  });

  it('notifies onSubmit when form is submitted', async () => {
    fetchSpy.mockImplementationOnce(() => fetchResponseOk({}));
    const onSubmitSpy = jest.fn();

    render(<AppointmentForm onSubmit={onSubmitSpy}/>);
    await submit(getForm(formId));

    expect(onSubmitSpy).toHaveBeenCalled();
  });

  it('renders error message when fetch call fails', async () => {
    fetchSpy.mockImplementationOnce(() => fetchResponseError());
    render(<AppointmentForm onSubmit={() => {}}/>);
    await submit(getForm(formId));
    const errorElement = getElement('.error');
    expect(errorElement).not.toBeNull();
    expect(errorElement.textContent).toMatch('error occurred');
  });

  it('state is cleared when the form is submitted again', async () => {

    fetchSpy.mockImplementationOnce(() => fetchResponseError());
    render(<AppointmentForm onSubmit={() => {}}/>);
    await submit(getForm(formId));
    const errorElement = getElement('.error');
    expect(errorElement).not.toBeNull();

    fetchSpy.mockImplementationOnce(() => fetchResponseOk({}));
    await submit(getForm(formId));
    expect(getElement('.error')).toBeNull();
  });
});
