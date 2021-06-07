import {put, call} from 'redux-saga/effects';
import * as Relay from 'relay-runtime';
import {getEnvironment} from '../relayEnvironment';
import {Actions, CustomerStatuses} from './constans';

const {fetchQuery, graphql} = Relay;

const defaultState = {
  customer: {},
  appointments: [],
  status: undefined
};

export const reducer = (state = defaultState, action) => {
  switch (action.type) {
    case Actions.QUERY_CUSTOMER_SUBMITTING:
      return {...state, status: CustomerStatuses.SUBMITTING};
    case Actions.QUERY_CUSTOMER_FAILED:
      return {...state, status: CustomerStatuses.FAILED};
    case Actions.QUERY_CUSTOMER_SUCCESSFUL:
      return {
        ...state,
        customer: action.customer,
        appointments: action.appointments,
        status: CustomerStatuses.SUCCESSFUL
      };
    default:
      return state;
  }
};

export const query = graphql`
    query queryCustomerQuery($id: ID!) {
        customer(id: $id) {
            id
            firstName
            lastName
            phoneNumber
            appointments {
                startsAt
                stylist
                service
                notes
            }
        }
    }
`;

const convertStartsAt = appointment => ({
  ...appointment,
  startsAt: Number(appointment.startsAt)
});

export function* queryCustomer({id}) {
  yield put({type: Actions.QUERY_CUSTOMER_SUBMITTING});
  try {
    const {customer} = yield call(
      fetchQuery,
      getEnvironment(),
      query,
      {id}
    );
    yield put({
      type: Actions.QUERY_CUSTOMER_SUCCESSFUL,
      customer,
      appointments: customer.appointments.map(convertStartsAt)
    });
  } catch (e) {
    yield put({type: Actions.QUERY_CUSTOMER_FAILED});
  }
}
