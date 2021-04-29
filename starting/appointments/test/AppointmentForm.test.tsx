import * as React from 'react';
import {createContainer} from './helpers/domManipulations';
import {AppointmentForm} from '../src/components/appointmentForm/AppointmentForm';
import * as ReactTestUtils from "react-dom/test-utils";

describe('AppointmentForm', () => {
  let render, container;
  beforeEach(() => ({render, container} = createContainer()));
  const form = (id: string): HTMLFormElement => container.querySelector(`form[id="${id}"]`);
  const field = (name: string): HTMLElement => form('appointment').elements[name];
  const findOption = (dropdownNode: Element, textContent: string): HTMLElement => {
    const options = Array.from(dropdownNode.childNodes) as HTMLElement[];
    return options.find(
      option => option.textContent === textContent
    );
  };
  const timeSlotTable = () => container.querySelector('table#time-slots');
  const startsAtField = index =>  container.querySelectorAll(`input[name="startsAt"]`)[index];

  it('should render', function () {
    render(<AppointmentForm/>);
    expect(form('appointment')).not.toBeNull();
  });

  describe('service field', () => {
    const services = ['Cut', 'Blow-dry'];
    const serviceName = 'service'
    const formId = 'appointment'

    it('renders as a select box', () => {
      render(<AppointmentForm/>);
      expect(field(serviceName)).not.toBeNull();
      expect(field(serviceName).tagName).toEqual('SELECT');
    });

    it('lists all salon services', () => {
      render(<AppointmentForm selectableServices={services}/>);
      const optionNodes = Array.from(field(serviceName).childNodes) as HTMLOptionElement[];
      const renderedServices = optionNodes.map(node => node.textContent);
      expect(renderedServices).toEqual(expect.arrayContaining(services));
    });

    it('pre-selects the existing value', () => {
      render(<AppointmentForm selectableServices={services} service={services[0]}/>);
      const option = findOption(field(serviceName), services[0]) as HTMLOptionElement;
      expect(option.selected).toBeTruthy();
      expect(option.value).toEqual(services[0]);
    });

    it(`renders a label for the service select`, () => {
      render(<AppointmentForm selectableServices={services} service={services[0]}/>);
      const serviceLabel = container.querySelector(`label[for="${serviceName}"]`)
      expect(serviceLabel).not.toBeNull();
      expect(serviceLabel.textContent).toEqual('Select a service you need:');
    });

    it(`assigns an id that matches the label id to the service field`, () => {
      render(<AppointmentForm/>);
      expect(field(serviceName).id).toEqual(serviceName);
    });

    it('has a submit button', () => {
      render(<AppointmentForm/>);
      const submitButton = container.querySelector('input[type="submit"]');
      expect(submitButton).not.toBeNull();
    });

    it(`saves existing service option when submitted`, async () => {
      render(<AppointmentForm
        selectableServices={services}
        service={services[0]}
        submitted={({selectedService}) => {
          expect(selectedService).toEqual(services[0])
        }}
      />);

      ReactTestUtils.Simulate.submit(form(formId));
    })

    it(`saves changed service option when submitted`, async () => {
      const initialValue = services[0];
      const changedValue = services[1];

      render(<AppointmentForm
        selectableServices={services}
        service={initialValue}
        submitted={({selectedService}) => {
          expect(selectedService).toEqual(changedValue)
        }}
      />);

      ReactTestUtils.Simulate.change(field(serviceName), {
        target: {value: changedValue, name: serviceName} as unknown as EventTarget
      });
      ReactTestUtils.Simulate.submit(form(formId));
    })
  });

  describe('time slot table', () => {
    it('renders a table for time slots', () => {
      render(<AppointmentForm/>);
      expect(container.querySelector('table#time-slots')).not.toBeNull();
    });

    it('renders a time slot for every half an hour between open and close times', () => {
      render(<AppointmentForm salonOpensAt={9} salonClosesAt={11}/>);
      const timesOfDay = timeSlotTable().querySelectorAll('tbody >* th');

      expect(timesOfDay).toHaveLength(4);
      expect(timesOfDay[0].textContent).toEqual('09:00');
      expect(timesOfDay[1].textContent).toEqual('09:30');
      expect(timesOfDay[3].textContent).toEqual('10:30');
    });

    it('renders an empty cell at the start of the header row', () => {
      render(<AppointmentForm />);
      const headerRow = timeSlotTable().querySelector('thead > tr');
      expect(headerRow.firstChild.textContent).toEqual('');
    });

    it('renders a week of available dates', () => {
      const today = new Date(2021, 4, 26);
      render(<AppointmentForm today={today}/>);
      const dates = timeSlotTable().querySelectorAll('thead >* th:not(:first-child)');

      expect(dates).toHaveLength(7);
      expect(dates[0].textContent).toEqual('Wed 26');
      expect(dates[1].textContent).toEqual('Thu 27');
      expect(dates[6].textContent).toEqual('Tue 01');
    });

    it('renders a radio button for each time slot', () => {
      const today = new Date();
      const availableTimeSlots = [
        { startsAt: today.setHours(9, 0, 0, 0) },
        { startsAt: today.setHours(9, 30, 0, 0) }
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />
      );
      const cells = timeSlotTable().querySelectorAll('td');
      expect(cells[0].querySelector('input[type="radio"]')).not.toBeNull();
      expect(cells[7].querySelector('input[type="radio"]')).not.toBeNull();
    });

    it('does not render radio buttons for unavailable time slots', () => {
      render(<AppointmentForm availableTimeSlots={[]} />);
      const timesOfDay = timeSlotTable().querySelectorAll('input');
      expect(timesOfDay).toHaveLength(0);
    });

    it('sets radio button values to the index of the corresponding appointment', () => {
      const today = new Date();
      const availableTimeSlots = [
        {startsAt: today.setHours(9, 0, 0, 0)},
        {startsAt: today.setHours(9, 30, 0, 0)}
      ];
      render(
        <AppointmentForm
          availableTimeSlots={availableTimeSlots}
          today={today}
        />);
      expect(startsAtField(0).value).toEqual(availableTimeSlots[0].startsAt.toString());
      expect(startsAtField(1).value).toEqual(availableTimeSlots[1].startsAt.toString());
    });
  });
});
