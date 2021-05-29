import {storeSpy, expectRedux} from 'expect-redux';
import {configureStore} from '../../src/store';

describe('addCustomer', () => {
  let store;

  beforeEach(() => {
    store = configureStore([storeSpy]);
  });

  const dispatchRequest = customer => {
    store.dispatch({
      type: 'ADD_CUSTOMER_REQUEST',
      customer
    });
  };

  it('sets current status to submitting', () => {
    dispatchRequest();
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({type: 'ADD_CUSTOMER_SUBMITTING'});
  });
});
