import 'whatwg-fetch';
import {storeSpy, expectRedux} from 'expect-redux';
import {configureStore} from '../../src/store';
import {customerReducer as reducer} from '../../src/reducers/customerReducer';
import {fetchResponseError, fetchResponseOk} from '../helpers/spyHelpers';
import {Actions, CustomerStatuses} from "../../src/sagas/constans";
import {itMaintainsExistingState, itSetsStatus} from '../helpers/reducerGenerators';

describe('addCustomer', () => {
  let store;
  const fetchSpy = jest.spyOn(window, 'fetch');
  const customer = {id: 123};

  beforeEach(() => {
    store = configureStore([storeSpy]);
  });

  const dispatchRequest = customer => {
    store.dispatch({
      type: Actions.ADD_CUSTOMER_REQUEST,
      customer
    });
  };

  it('sets current status to submitting', () => {
    dispatchRequest();
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({type: Actions.ADD_CUSTOMER_SUBMITTING});
  });

  it('submits request to the fetch api', async () => {
    const inputCustomer = {firstName: 'Ashley'};
    dispatchRequest(inputCustomer);

    expect(window.fetch).toHaveBeenCalledWith('/customers', {
      body: JSON.stringify(inputCustomer),
      method: 'POST',
      credentials: 'same-origin',
      headers: {'Content-Type': 'application/json'}
    });
  });

  it('dispatches ADD_CUSTOMER_SUCCESSFUL on success', () => {
    fetchSpy.mockReturnValue(fetchResponseOk(customer));
    dispatchRequest();
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({type: Actions.ADD_CUSTOMER_SUCCESSFUL, customer});
  });

  it('dispatches ADD_CUSTOMER_FAILED on non-specific error', () => {
    fetchSpy.mockReturnValue(fetchResponseError());
    dispatchRequest();
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({type: Actions.ADD_CUSTOMER_FAILED});
  });

  it('dispatches ADD_CUSTOMER_VALIDATION_FAILED if validation errors were returned', () => {
    const errors = {field: 'field', description: 'error text'};
    fetchSpy.mockReturnValue(fetchResponseError(422, {errors}));
    dispatchRequest();
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: Actions.ADD_CUSTOMER_VALIDATION_FAILED,
        validationErrors: errors
      });
  });
});

describe('reducer', () => {
  it('returns a default state for an undefined existing state', () => {
    const defaultStoreState = {
      customer: {},
      status: undefined,
      validationErrors: {},
      error: false
    };

    expect(reducer(undefined, {})).toEqual(defaultStoreState);
  });

  describe('ADD_CUSTOMER_SUBMITTING action', () => {
    const action = {type: Actions.ADD_CUSTOMER_SUBMITTING};

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, CustomerStatuses.SUBMITTING);
  });

  describe('ADD_CUSTOMER_FAILED action', () => {
    const action = {type: Actions.ADD_CUSTOMER_FAILED};

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, CustomerStatuses.FAILED);

    it('sets error to true', () => {
      expect(reducer(undefined, action)).toMatchObject({
        error: true
      });
    });
  })

  describe('ADD_CUSTOMER_VALIDATION_FAILED action', () => {
    const validationErrors = {field: "error text"};
    const action = {
      type: Actions.ADD_CUSTOMER_VALIDATION_FAILED,
      validationErrors
    };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, CustomerStatuses.VALIDATION_FAILED);

    it('sets validation errors to provided errors', () => {
      expect(reducer(undefined, action)).toMatchObject({
        validationErrors
      });
    });
  });

  describe('ADD_CUSTOMER_SUCCESSFUL action', () => {
    const customer = {id: 123};
    const action = {
      type: Actions.ADD_CUSTOMER_SUCCESSFUL,
      customer
    };

    itMaintainsExistingState(reducer, action);
    itSetsStatus(reducer, action, CustomerStatuses.SUCCESSFUL);

    it('sets customer to provided customer', () => {
      expect(reducer(undefined, action)).toMatchObject({customer});
    });
  });
});
