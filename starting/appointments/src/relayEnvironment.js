import {
  Environment,
  Network,
  RecordSource,
  Store
} from 'relay-runtime';

export const performFetch = async (operation, variables) => {
  let result = null;
  try {
    result = await window.fetch('/graphql', {
      method: 'POST',
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify({
        query: operation.text,
        variables
      })
    });
  } catch (err) {
    throw new Error(`Something goes wrong on the client. Couldn't get the server. ${err.message}`);
  }

  if (!result.ok) {
    throw new Error(result.status);
  }

  return result.json();
};

let environment = null;
export const getEnvironment = () => {
  return environment || (environment = new Environment({
        network: Network.create(performFetch),
        store: new Store(new RecordSource())
      }));
}


