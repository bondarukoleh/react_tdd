import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {takeLatest} from "redux-saga/effects";
import {addCustomer, searchCustomers} from './sagas/customer';
import {customerAdded} from './sagas/app';
import {customerReducer} from './reducers/customerReducer';
import {Actions} from "./sagas/constans";
import {appointmentReducer} from "./reducers/appointmentReducer";
import {
  queryCustomer,
  reducer as queryCustomerReducer
} from './sagas/queryCustomer';

function* rootSaga() {
  yield takeLatest(Actions.ADD_CUSTOMER_REQUEST, addCustomer);
  yield takeLatest(Actions.ADD_CUSTOMER_SUCCESSFUL, customerAdded);
  yield takeLatest(Actions.QUERY_CUSTOMER_REQUEST, queryCustomer);
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    combineReducers({
      customer: customerReducer,
      appointment: appointmentReducer,
      queryCustomer: queryCustomerReducer,
    }),
    compose(...[applyMiddleware(sagaMiddleware), ...storeEnhancers])
  );
  sagaMiddleware.run(rootSaga);
  return store;
};
