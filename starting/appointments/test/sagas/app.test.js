import {storeSpy, expectRedux} from 'expect-redux';
import {configureStore} from '../../src/store';
import {appHistory} from '../../src/history';
import {Actions} from "../../src/sagas/constans";

describe('customerAdded', () => {
  let store, pushSpy;

  beforeEach(() => {
    pushSpy = jest.spyOn(appHistory, 'push');
    store = configureStore([storeSpy]);
  });

  const dispatchRequest = customer =>
    store.dispatch({
      type: Actions.ADD_CUSTOMER_SUCCESSFUL,
      customer
    });

  it('pushes /addAppointment to history', () => {
    dispatchRequest();
    expect(pushSpy).toHaveBeenCalledWith('/addAppointment');
  });

  it(`dispatches a ${Actions.SET_CUSTOMER_FOR_APPOINTMENT} action`, () => {
    const customer = {id: 123};

    dispatchRequest(customer);
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({
        type: Actions.SET_CUSTOMER_FOR_APPOINTMENT,
        customer
      });
  });
});
