import {Actions, CustomerStatuses} from "../sagas/constans";

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
