import * as React from 'react';
import {useEffect, useState, Fragment, useCallback} from "react";

const ToggleButton = ({ id, onClick, toggled, children }) => {
  let className = 'toggle-button';
  if (toggled) {
    className += ' toggled';
  }
  return (
    <a id={id} onClick={onClick} className={className}>
      {children}
    </a>
  );
};

const SearchButtons = (
  {
    handleNext,
    handlePrevious,
    hasNext,
    hasPrevious,
    handleLimit,
    limit
  }) => {
  return (
    <div className="button-bar">
      <ToggleButton
        id="limit-10"
        onClick={() => handleLimit(10)}
        toggled={limit === 10}>
        10
      </ToggleButton>
      <ToggleButton
        id="limit-20"
        onClick={() => handleLimit(20)}
        toggled={limit === 20}>
        20
      </ToggleButton>
      <ToggleButton
        id="limit-50"
        onClick={() => handleLimit(50)}
        toggled={limit === 50}>
        50
      </ToggleButton>
      <ToggleButton
        id="limit-100"
        onClick={() => handleLimit(100)}
        toggled={limit === 100}>
        100
      </ToggleButton>
      <button
        role="button"
        id="previous-page"
        onClick={handlePrevious}
        disabled={!hasPrevious}
      >
        Previous
      </button>
      <button
        role="button"
        id="next-page"
        onClick={handleNext}
        disabled={!hasNext}
      >
        Next
      </button>
    </div>
  )
};

export const CustomerSearch = ({renderCustomerActions}) => {
  const [customers, setCustomers] = useState([]);
  const [lastRowIds, setLastRowIds] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [limit, setLimit] = useState(10);

  const buildSearchParams = (searchObject) => {
    const query = Object.entries(searchObject)
      .filter(([key, value]) => value && value !== '')
      // @ts-ignore
      .map(([key, value]) => `${key}=${encodeURIComponent(value)}`)
      .join('&');

    if (query) {
      return `?${query}`
    }
    return '';
  };

  useEffect(() => {
    const fetchData = async () => {
      let lastVisibleCustomerId;
      if (lastRowIds.length > 0) {
        lastVisibleCustomerId = lastRowIds[lastRowIds.length - 1];
      }
      let queryString = buildSearchParams({after: lastVisibleCustomerId, searchTerm, limit: limit !== 10 && limit });
      const result = await window.fetch(`/customers${queryString}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      });
      setCustomers(await result.json());
    }
    fetchData();
  }, [lastRowIds, searchTerm, limit]);

  const hasNextUsers = customers.length === limit;
  const hasPreviousUsers = lastRowIds.length > 0;

  const handleNext = useCallback( async () => {
    const lastVisibleCustomerID = customers[customers.length - 1].id;
    setLastRowIds((previousIDs) => [...previousIDs, lastVisibleCustomerID]);
  }, [customers, lastRowIds])

  const handlePrevious = useCallback(() => {
    setLastRowIds((oldQueries) => oldQueries.slice(0, -1));
  }, [lastRowIds]);

  const handleSearchTextChanged = ({target: {value}}) => setSearchTerm(value);

  const CustomerRow = ({ customer, renderCustomerActions}) => {
    return (
      <tr>
        <td>{customer.firstName}</td>
        <td>{customer.lastName}</td>
        <td>{customer.phoneNumber}</td>
        <td>{renderCustomerActions(customer)}</td>
      </tr>
    )
  };

  return (
    <Fragment>
      <input
        placeholder="Enter filter text"
        onChange={handleSearchTextChanged}
        value={searchTerm}
      />
      <SearchButtons
        handleNext={handleNext}
        handlePrevious={handlePrevious}
        hasNext={hasNextUsers}
        hasPrevious={hasPreviousUsers}
        handleLimit={setLimit}
        limit={limit}
      />
      <table>
        <thead>
        <tr>
          <th>First name</th>
          <th>Last name</th>
          <th>Phone number</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        {customers.map(customer => {
          return <CustomerRow
            customer={customer}
            key={customer.id}
            renderCustomerActions={renderCustomerActions}
          />
        })}
        </tbody>
      </table>
    </Fragment>
  );
};

CustomerSearch.defaultProps = {
  renderCustomerActions: () => {}
};
