import 'whatwg-fetch';
import {fetchResponseOk, fetchResponseError} from './helpers/spyHelpers';
import {performFetch, getEnvironment} from '../src/relayEnvironment';
import {
  Environment,
  Network,
  Store,
  RecordSource
} from 'relay-runtime';

jest.mock('relay-runtime');

describe('performFetch', () => {
  let response = {data: {id: 123}};
  const text = 'test';
  const variables = {a: 123};

  beforeEach(() => {
    jest
      .spyOn(window, 'fetch')
      .mockReturnValue(fetchResponseOk(response));
  });

  it('calls window fetch', () => {
    performFetch({text}, variables);

    expect(window.fetch).toHaveBeenCalledWith('/graphql', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        query: text,
        variables
      })
    });
  });

  it('returns the request data', async () => {
    const result = await performFetch({text}, variables);
    expect(result).toEqual(response);
  });

  it('rejects when the request fails', () => {
    window.fetch.mockReturnValue(fetchResponseError(500));
    return expect(performFetch({text}, variables)).rejects.toEqual(
      new Error(500)
    );
  });
});

describe('getEnvironment', () => {
  const environment = {a: 123};
  beforeAll(() => {
    Environment.mockImplementation(() => environment);
    getEnvironment();
  });

  it('returns environment', () => {
    expect(getEnvironment()).toEqual(environment);
  });
});
