import React from 'react';
import 'whatwg-fetch';
import {createContainer} from './helpers/domManipulations';
import {fetchResponseOk} from './helpers/spyHelpers';
import {AppointmentFormLoader} from '../src/containers/AppointmentFormLoader';
import * as AppointmentFormExports from '../src/components/AppointmentForm';

describe('AppointmentFormLoader', () => {
  let container, fetchSpy, AppointmentFormSpy, asyncRender;
  const today = new Date();
  const availableTimeSlots = [{startsAt: today.setHours(9, 0, 0, 0)}];

  beforeEach(() => {
    ({asyncRender, container} = createContainer());
    fetchSpy = jest.spyOn(window, 'fetch').mockReturnValue(fetchResponseOk(availableTimeSlots));
    AppointmentFormSpy = jest.spyOn(AppointmentFormExports, 'AppointmentForm').mockReturnValue(null);
  });
  afterEach(() => {
    fetchSpy.mockRestore();
    AppointmentFormSpy.mockRestore();
  });

  it('fetches data when component is mounted', async () => {
    await asyncRender(<AppointmentFormLoader/>);
    expect(window.fetch).toHaveBeenCalledWith('/availableTimeSlots',
      expect.objectContaining({
        method: 'GET',
        credentials: 'same-origin',
        headers: {'Content-Type': 'application/json'}
      })
    );
  });

  it('initially passes no data to AppointmentForm', async () => {
    await asyncRender(<AppointmentFormLoader/>);

    expect(AppointmentFormSpy.mock.calls.pop()[0]).toHaveProperty('availableTimeSlots')
  });

  it('displays time slots that are fetched on mount', async () => {
    await asyncRender(<AppointmentFormLoader />);
    expect(AppointmentFormSpy.mock.calls.pop()[0].availableTimeSlots).toEqual(expect.arrayContaining(availableTimeSlots))
  });

  it('passes props through to children', async () => {
    await asyncRender(<AppointmentFormLoader testProp={123} />);
    expect(AppointmentFormExports.AppointmentForm).toHaveBeenCalledWith(
      expect.objectContaining({ testProp: 123 }),
      expect.anything()
    );
  });

});
