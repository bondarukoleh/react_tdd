import {Actions} from "../sagas/constans";

const defaultState = {
  customer: {}
};

export const appointmentReducer = (state = defaultState, action) => {
  switch (action.type) {
    case Actions.SET_CUSTOMER_FOR_APPOINTMENT:
      return { ...state, customer: action.customer };
    default:
      return state;
  }
};
