import * as React from 'react';
import {useEffect, useState, Fragment, useCallback} from "react";

export const CustomerSearch = () => {
  const [customers, setCustomers] = useState([]);
  const [queryStrings, setQueryStrings] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      let queryString = '';
      if (queryStrings.length > 0) {
        queryString = queryStrings[queryStrings.length - 1]
      };
      const result = await window.fetch(`/customers${queryString}`, {
        method: 'GET',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      });
      setCustomers(await result.json());
    }
    fetchData();
  }, [queryStrings]);

  const handleNext = useCallback( async () => {
    const after = customers[customers.length - 1].id;
    const newQueryString = `?after=${after}`;
    setQueryStrings((oldQueries) => [...oldQueries, newQueryString]);
  }, [customers, queryStrings])

  const handlePrevious = useCallback(() => {
    setQueryStrings((oldQueries) => oldQueries.slice(0, -1));
  }, [queryStrings]);

  const CustomerRow = ({ customer }) => {
    return (
      <tr>
        <td>{customer.firstName}</td>
        <td>{customer.lastName}</td>
        <td>{customer.phoneNumber}</td>
        <td />
      </tr>
    )
  };

  const SearchButtons = ({handleNext, handlePrevious}) => {
    return (
      <div className="button-bar">
        <button role="button" id="previous-page" onClick={handlePrevious}>
          Previous
        </button>
        <button role="button" id="next-page" onClick={handleNext}>
          Next
        </button>
      </div>
    )
  };

  return (
    <Fragment>
      <SearchButtons handleNext={handleNext} handlePrevious={handlePrevious}/>
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
        {customers.map(customer => <CustomerRow customer={customer} key={customer.id}/>)}
        </tbody>
      </table>
    </Fragment>
  );
};
