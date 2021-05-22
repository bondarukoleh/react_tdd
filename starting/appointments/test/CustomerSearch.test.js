import React from 'react';
import 'whatwg-fetch';
import {createContainer, withEvent} from './helpers/domManipulations';
import {CustomerSearch} from '../src/components/CustomerSearch';
import {fetchResponseOk} from './helpers/spyHelpers';

const oneCustomer = [
  {id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1'}
];
const twoCustomers = [
  {id: 1, firstName: 'A', lastName: 'B', phoneNumber: '1'},
  {id: 2, firstName: 'C', lastName: 'D', phoneNumber: '2'}
];
const tenCustomers = Array.from('0123456789', id => ({id}));
const anotherTenCustomers = Array.from('ABCDEFGHIJ', id => ({id}));
const lessThanTenCustomers = Array.from('0123456', id => ({id}));
const twentyCustomers = Array.from('0123456789ABCDEFGHIJ', id => ({id}));

describe('CustomerSearch', () => {
  let asyncRender, container, getElement, getElements, render, getForm, asyncClick, asyncChange;

  beforeEach(() => {
    ({
      asyncRender,
      container,
      getElement,
      getElements,
      render,
      getForm,
      asyncClick,
      asyncChange,
    } = createContainer());
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk([]));
  });

  it('renders a table with four headings', async () => {
    await asyncRender(<CustomerSearch/>);
    const headings = getElements('table th');
    expect(headings.map(h => h.textContent)).toEqual([
      'First name',
      'Last name',
      'Phone number',
      'Actions'
    ]);
  });

  it('fetches all customer data when component mounts', async () => {
    await asyncRender(<CustomerSearch/>);
    expect(window.fetch).toHaveBeenCalledWith('/customers', {
      method: 'GET',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}
    });
  });

  it('renders all customer data in a table row', async () => {
    const [{firstName, lastName, phoneNumber}] = oneCustomer;

    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await asyncRender(<CustomerSearch/>);
    const columns = getElements('table > tbody > tr > td');
    expect(columns[0].textContent).toEqual(firstName);
    expect(columns[1].textContent).toEqual(lastName);
    expect(columns[2].textContent).toEqual(phoneNumber);
  });

  it('renders multiple customer rows', async () => {
    const [, secondCustomer] = twoCustomers;

    window.fetch.mockReturnValue(fetchResponseOk(twoCustomers));
    await asyncRender(<CustomerSearch/>);
    const rows = getElements('table tbody tr');
    expect(rows[1].childNodes[0].textContent).toEqual(secondCustomer.firstName);
  });

  it('has a next button', async () => {
    await asyncRender(<CustomerSearch/>);
    expect(getElement('button#next-page')).not.toBeNull();
  });

  it('requests next page of data when next button is clicked', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await asyncRender(<CustomerSearch/>);
    await asyncClick(getElement('button#next-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?after=9',
      expect.anything()
    );
  });

  it('displays next page of data when next button is clicked', async () => {
    const nextCustomer = [{id: 'next', firstName: 'Next'}];
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(nextCustomer));
    await asyncRender(<CustomerSearch/>);
    await asyncClick(getElement('button#next-page'));
    expect(getElements('tbody tr').length).toEqual(1);
    expect(getElements('td')[0].textContent).toEqual('Next');
  });

  it('has a previous button', async () => {
    await asyncRender(<CustomerSearch/>);
    expect(getElement('button#previous-page')).not.toBeNull();
  });

  it('moves back to first page when previous button is clicked', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await asyncRender(<CustomerSearch/>);
    await asyncClick(getElement('button#next-page'));
    await asyncClick(getElement('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers',
      expect.anything()
    );
  });

  it('moves back one page when clicking previous after multiple clicks of the next button', async () => {
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(anotherTenCustomers));
    await asyncRender(<CustomerSearch/>);
    await asyncClick(getElement('button#next-page'));
    await asyncClick(getElement('button#next-page'));
    await asyncClick(getElement('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?after=9',
      expect.anything()
    );
  });

  it('moves back multiple pages', async () => {
    window.fetch
      .mockReturnValueOnce(fetchResponseOk(tenCustomers))
      .mockReturnValue(fetchResponseOk(anotherTenCustomers));
    await asyncRender(<CustomerSearch/>);
    await asyncClick(getElement('button#next-page'));
    await asyncClick(getElement('button#next-page'));
    await asyncClick(getElement('button#previous-page'));
    await asyncClick(getElement('button#previous-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers',
      expect.anything()
    );
  });

  it('has a search input field with a placeholder', async () => {
    await asyncRender(<CustomerSearch/>);
    expect(getElement('input')).not.toBeNull();
    expect(getElement('input').getAttribute('placeholder')).toEqual(
      'Enter filter text'
    );
  });

  it('performs search when search term is changed', async () => {
    await asyncRender(<CustomerSearch/>);
    await asyncChange(
      getElement('input'),
      withEvent('input', 'name')
    );
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?searchTerm=name',
      expect.anything()
    );
  });

  it('includes search term when moving to next page', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await asyncRender(<CustomerSearch/>);
    await asyncChange(
      getElement('input'),
      withEvent('input', 'name')
    );
    await asyncClick(getElement('button#next-page'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?after=9&searchTerm=name',
      expect.anything()
    );
  });

  it('displays provided action buttons for each customer', async () => {
    const actionSpy = jest.fn();
    actionSpy.mockReturnValue('actions');
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await asyncRender(<CustomerSearch renderCustomerActions={actionSpy}/>);
    const rows = getElements('table tbody td');
    expect(rows[rows.length - 1].textContent).toEqual('actions');
  });

  it('passes customer to the renderCustomerActions prop', async () => {
    const actionSpy = jest.fn();
    actionSpy.mockReturnValue('actions');
    window.fetch.mockReturnValue(fetchResponseOk(oneCustomer));
    await asyncRender(
      <CustomerSearch renderCustomerActions={actionSpy}/>
    );
    expect(actionSpy).toHaveBeenCalledWith(oneCustomer[0]);
  });

  it('initially disables previous page', async () => {
    await asyncRender(<CustomerSearch/>);
    expect(getElement('button#previous-page').getAttribute('disabled')).not.toBeNull();
  });

  it('enables previous page button once next page button has been clicked', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await asyncRender(<CustomerSearch/>);
    await asyncClick(getElement('button#next-page'));
    expect(
      getElement('button#previous-page').getAttribute('disabled')
    ).toBeNull();
  });

  it('disables next page button if there are less than ten results on the page', async () => {
    window.fetch.mockReturnValue(
      fetchResponseOk(lessThanTenCustomers)
    );
    await asyncRender(<CustomerSearch/>);
    expect(
      getElement('button#next-page').getAttribute('disabled')
    ).not.toBeNull();
  });

  it('has a button with a label of 10 that is initially toggled', async () => {
    await asyncRender(<CustomerSearch/>);
    const button = getElement('a#limit-10');
    expect(button.className).toContain('toggle-button');
    expect(button.className).toContain('toggled');
    expect(button.textContent).toEqual('10');
  });

  [20, 50, 100].forEach(limitSize => {
    it(`has a button with a label of ${limitSize} that is initially not toggled`, async () => {
      await asyncRender(<CustomerSearch/>);
      const button = getElement(`a#limit-${limitSize}`);
      expect(button).not.toBeNull();
      expect(button.className).toContain('toggle-button');
      expect(button.className).not.toContain('toggled');
      expect(button.textContent).toEqual(limitSize.toString());
    });

    it(`searches by ${limitSize} records when clicking on ${limitSize}`, async () => {
      await asyncRender(<CustomerSearch/>);
      await asyncClick(getElement(`a#limit-${limitSize}`));
      expect(window.fetch).toHaveBeenLastCalledWith(
        `/customers?limit=${limitSize}`,
        expect.anything()
      );
    });
  });

  it('searches by 10 records when clicking on 10', async () => {
    await asyncRender(<CustomerSearch/>);
    await asyncClick(getElement('a#limit-20'));
    await asyncClick(getElement('a#limit-10'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers',
      expect.anything()
    );
  });

  it('next button still enabled if limit changes', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(twentyCustomers));
    await asyncRender(<CustomerSearch/>);
    await asyncClick(getElement('a#limit-20'));
    expect(
      getElement('button#next-page').getAttribute('disabled')
    ).toBeNull();
  });

  it('changing limit maintains current page', async () => {
    window.fetch.mockReturnValue(fetchResponseOk(tenCustomers));
    await asyncRender(<CustomerSearch/>);
    await asyncClick(getElement('button#next-page'));
    await asyncClick(getElement('a#limit-20'));
    expect(window.fetch).toHaveBeenLastCalledWith(
      '/customers?after=9&limit=20',
      expect.anything()
    );
  });
});
