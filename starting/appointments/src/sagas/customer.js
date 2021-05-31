import {put, call} from 'redux-saga/effects';
import {Actions, CustomerStatuses} from './constans';

const fetch = (url, data) => {
  return window.fetch(url, {
    body: JSON.stringify(data),
    method: 'POST',
    credentials: 'same-origin',
    headers: {'Content-Type': 'application/json'}
  });
};

export function* addCustomer({customer}) {
  yield put({type: 'ADD_CUSTOMER_SUBMITTING'});
  const result = yield call(fetch, '/customers', customer);
  if (result?.ok) {
    const customerWithId = yield call([result, 'json']);
    yield put({
      type:  Actions.ADD_CUSTOMER_SUCCESSFUL,
      customer: customerWithId
    });
  } else if (result?.status === 422) {
    const response = yield call([result, 'json']);
    yield put({
      type: Actions.ADD_CUSTOMER_VALIDATION_FAILED,
      validationErrors: response.errors
    });
  } else {
    yield put({
      type: Actions.ADD_CUSTOMER_FAILED,
    });
  }
}

const defaultState = {
  customer: {},
  status: undefined,
  validationErrors: {},
  error: false
};

export const customerReducer = (state = defaultState, action) => {
  switch (action.type) {
    case Actions.ADD_CUSTOMER_SUBMITTING:
      return {...state, status: CustomerStatuses.SUBMITTING};
    case Actions.ADD_CUSTOMER_SUCCESSFUL:
      return {...state, status: CustomerStatuses.SUCCESSFUL, customer: action.customer};
    case Actions.ADD_CUSTOMER_FAILED:
      return {...state, status: CustomerStatuses.FAILED, error: true};
    case Actions.ADD_CUSTOMER_VALIDATION_FAILED:
      return {...state, status: CustomerStatuses.VALIDATION_FAILED, validationErrors: action.validationErrors};
    default:
      return state;
  }
};
