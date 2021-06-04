import {createStore, applyMiddleware, compose, combineReducers} from 'redux';
import createSagaMiddleware from 'redux-saga';
import {takeLatest} from "redux-saga/effects";
import {addCustomer} from './sagas/customer';
import {customerAdded} from './sagas/app';
import {customerReducer} from './reducers/customerReducer';
import {Actions} from "./sagas/constans";
import {appointmentReducer} from "./reducers/appointmentReducer";

function* rootSaga() {
  yield takeLatest(Actions.ADD_CUSTOMER_REQUEST, addCustomer);
  yield takeLatest(Actions.ADD_CUSTOMER_SUCCESSFUL, customerAdded);
}

export const configureStore = (storeEnhancers = []) => {
  const sagaMiddleware = createSagaMiddleware();
  const store = createStore(
    combineReducers({
      customer: customerReducer,
      appointment: appointmentReducer
    }),
    compose(...[applyMiddleware(sagaMiddleware), ...storeEnhancers])
  );
  sagaMiddleware.run(rootSaga);
  return store;
};
