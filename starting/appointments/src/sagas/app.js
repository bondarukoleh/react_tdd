import {put} from 'redux-saga/effects';
import {appHistory} from '../history';
import {Actions} from "./constans";

export function* customerAdded({customer}) {
  yield put({type: Actions.SET_CUSTOMER_FOR_APPOINTMENT, customer});
  appHistory.push('/addAppointment');
}
