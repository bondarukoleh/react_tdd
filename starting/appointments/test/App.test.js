import React from 'react';
import {
  createShallowRenderer,
  predicateByType,
  predicateByClassName,
  predicateById,
  click,
  childrenOf,
  predicateByProp
} from './helpers/shallowHelpers';
import {App, MainScreen, Routes} from '../src/App';
import {AppointmentsDayViewLoader} from '../src/containers/AppointmentsDayViewLoader';
import {AppointmentFormLoader} from '../src/containers/AppointmentFormLoader';
import {CustomerForm} from '../src/components/CustomerForm';
import {CustomerSearch} from "../src/components/CustomerSearch";
import {Link, Switch} from "react-router-dom";

describe('MainScreen', () => {
  let render, child, elementMatching;

  beforeEach(() => {
    ({render, child, elementMatching} = createShallowRenderer());
  });

  it('renders a button bar as the first child', () => {
    render(<MainScreen />);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });

  it('renders an AppointmnentsDayViewLoader', () => {
    render(<MainScreen />);
    expect(elementMatching(predicateByType(AppointmentsDayViewLoader))).toBeDefined();
  });

  it('renders a Link to /addCustomer', () => {
    render(<MainScreen />);
    const links = childrenOf(elementMatching(predicateByClassName('button-bar')));
    expect(links[0].type).toEqual(Link);
    expect(links[0].props.to).toEqual('/addCustomer');
    expect(links[0].props.className).toEqual('button');
    expect(links[0].props.children).toEqual('Add customer and appointment');
  });

  it('renders a Link to /searchCustomers', () => {
    render(<MainScreen />);
    const links = childrenOf(elementMatching(predicateByClassName('button-bar')));
    expect(links[1].type).toEqual(Link);
    expect(links[1].props.to).toEqual('/searchCustomers');
    expect(links[1].props.className).toEqual('button');
    expect(links[1].props.children).toEqual('Search customers');
  });
});

describe('App', () => {
  let render, elementMatching, child;
  let historySpy;

  beforeEach(() => {
    ({
      render,
      elementMatching,
      child,
    } = createShallowRenderer());
    historySpy = jest.fn();
  });

  const switchElement = () => elementMatching(predicateByType(Switch));
  const childRoutes = () => childrenOf(elementMatching(predicateByType(Switch)));
  const routeFor = path => childRoutes().find(predicateByProp('path', path));

  it('renders the MainScreen as the default route', () => {
    render(<App />);
    expect(routeFor(Routes.dayView).props.component).toEqual(MainScreen);
  });

  it('renders CustomerForm at the /addCustomer endpoint', () => {
    render(<App />);
    expect(routeFor(Routes.addCustomer).props.render().type).toEqual(CustomerForm);
  });

  it('renders AppointmentFormLoader at /addAppointment', () => {
    render(<App />);
    expect(routeFor(Routes.addAppointment).props.render().type).toEqual(AppointmentFormLoader);
  });

  it('renders CustomerSearchRoute at /searchCustomers', () => {
    render(<App />);
    expect(routeFor(Routes.searchCustomers).props.render().type).toEqual(CustomerSearch);
  });

  const customer = { id: 123 };

  it('navigates to / when AppointmentFormLoader is saved', () => {
    render(<App history={{ push: historySpy }} />);
    routeFor(Routes.addAppointment).props.render().props.onSubmit();
    expect(historySpy).toHaveBeenCalledWith('/');
  });

  describe('search customers', () => {
    let dispatchSpy;

    beforeEach(() => {
      dispatchSpy = jest.fn();
    });

    const renderSearchActionsForCustomer = customer => {
      render(
        <App
          history={{ push: historySpy }}
          setCustomerForAppointment={dispatchSpy}
        />
      );
      const customerSearch = routeFor(Routes.searchCustomers).props.render();
      const searchActionsComponent = customerSearch.props.renderCustomerActions;
      return searchActionsComponent(customer);
    };

    it('passes a button to the CustomerSearch named Create appointment', () => {
      const button = childrenOf(renderSearchActionsForCustomer())[0];
      expect(button).toBeDefined();
      expect(button.type).toEqual('button');
      expect(button.props.role).toEqual('button');
      expect(button.props.children).toEqual('Create appointment');
    });

    it('navigates to /addAppointment when clicking the Create appointment button', () => {
      const button = childrenOf(renderSearchActionsForCustomer(customer))[0];
      click(button);
      expect(historySpy).toHaveBeenCalledWith(Routes.addAppointment);
    });
  });
});

/* Old tests, before Router */
describe.skip('App', () => {
  let render, elementMatching, child, elementsMatching;
  beforeEach(() => {
    ({render, elementMatching, elementsMatching, child} = createShallowRenderer());
  });
  const clickAddCustomer = () => click(elementMatching(predicateById('addCustomer')));
  const saveCustomer = customer => elementMatching(predicateByType(CustomerForm)).props.onSave(customer);
  const submitAppointment = () => elementMatching(predicateByType(AppointmentFormLoader)).props.onSubmit();
  const searchCustomers = () => {
    render(<App />);
    click(elementMatching(predicateById('searchCustomers')));
  };
  const renderSearchActionsForCustomer = customer => {
    searchCustomers();
    const customerSearch = elementMatching(predicateByType(CustomerSearch));
    const searchActionsComponent = customerSearch.props.renderCustomerActions;
    return searchActionsComponent(customer);
  };

  it('initially shows the AppointmentDayViewLoader', () => {
    render(<App/>);
    expect(elementMatching(predicateByType(AppointmentsDayViewLoader))).toBeDefined();
  });

  it('has a button bar as the first child', () => {
    render(<App/>);
    expect(child(0).type).toEqual('div');
    expect(child(0).props.className).toEqual('button-bar');
  });

  it('has a button to initiate add customer and appointment action', () => {
    render(<App/>);
    const buttons = childrenOf(elementMatching(predicateByClassName('button-bar')));
    expect(buttons[0].type).toEqual('button');
    expect(buttons[0].props.children).toEqual('Add customer and appointment');
  });

  it('displays the CustomerForm when button is clicked', async () => {
    render(<App/>);
    clickAddCustomer();
    expect(elementMatching(predicateByType(CustomerForm))).toBeDefined();
  });

  it('hides the AppointmentDayViewLoader when button is clicked', async () => {
    render(<App/>);
    clickAddCustomer();
    expect(elementMatching(predicateByType(AppointmentsDayViewLoader))).not.toBeDefined();
  });

  it('hides the button bar when CustomerForm is being displayed', async () => {
    render(<App/>);
    clickAddCustomer();
    expect(elementMatching(predicateByClassName('button-bar'))).not.toBeDefined();
  });

  it('displays the AppointmentFormLoader after the CustomerForm is submitted', async () => {
    render(<App/>);
    clickAddCustomer();
    saveCustomer();
    expect(elementMatching(predicateByType(AppointmentFormLoader))).toBeDefined();
  });

  it('passes the customer to the AppointmentForm', async () => {
    render(<App/>);
    const customer = {id: 123};
    clickAddCustomer();
    saveCustomer(customer);
    expect(elementMatching(predicateByType(AppointmentFormLoader)).props.customer).toBe(customer);
  });

  it('renders AppointmentDayViewLoader after AppointmentForm is submitted', async () => {
    render(<App/>);
    clickAddCustomer();
    saveCustomer();
    submitAppointment();
    expect(elementMatching(predicateByType(AppointmentsDayViewLoader))).toBeDefined();
  });

  it('displays the CustomerSearch when button is clicked', async () => {
    searchCustomers();
    expect(elementMatching(predicateByType(CustomerSearch))).toBeDefined();
  });

  it('passes a button to the CustomerSearch named Create appointment', async () => {
    const button = childrenOf(renderSearchActionsForCustomer())[0];
    expect(button).toBeDefined();
    expect(button.type).toEqual('button');
    expect(button.props.role).toEqual('button');
    expect(button.props.children).toEqual('Create appointment');
  });

  it('clicking appointment button shows the appointment form for that customer', async () => {
    const customer = {id: 123};
    const button = childrenOf(renderSearchActionsForCustomer(customer))[0];
    click(button);
    expect(elementMatching(predicateByType(AppointmentFormLoader))).not.toBeNull();
    expect(elementMatching(predicateByType(AppointmentFormLoader)).props.customer).toBe(customer);
  });
});
