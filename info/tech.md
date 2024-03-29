### Bringing in React and Babel
React makes heavy use of JavaScript XML (JSX), which we need Babel to transpile for us. Babel also transpiles our
modern ES6 and ES7 constructs for us. Thankfully, Jest already includes Babel, so we just need to install presets and
plugins:
```shell
npm i -ED @babel/preset-env @babel/preset-react @babel/plugin-transform-runtime 
npm i -E @babel/runtime
```
A Babel preset is a set of plugins. Each plugin enables a specific feature of the ECMAScript
standards, or a preprocessor such as JSX.

### Jest
Jest magically includes a DOM implementation in global, which is why we have access to `document`. It uses `jsdom`, a
headless implementation of the **DOM**. We can do test browser interactions on the command line, which is much simpler
than involving a browser in our work. In Jest lingo, this is called the *Jest environment*. \
In cofig we can set the test environment:
```json
 "jest": {
    "testEnvironment": "node"
    "testEnvironment": "jsdom"
  }
```

#### Rendering React from a test
In order to React component render, we'll need to call the `ReactDOM.render` function. This function takes a
component, performs the React render magic, and replaces an existing DOM node with the newly rendered node tree.
The DOM node it replaces is known as the React *container*.
```js
ReactDOM.render(component, container);
```
Component - it's a JSX fragment that takes our customer as a prop:
```js
const customer = { firstName: 'Ashley' };
const component = <Appointment customer={customer} />;
```
We can use the DOM to create a container element:
```js
const container = document.createElement('div');
document.body.appendChild(container);
```
As we're using both *ReactDOM* and *JSX*, we'll need to include the two standard React import:
```js
import React from 'react';
import ReactDOM from 'react-dom';
```

React components interoperate to **synthetic events**. React uses these to mask browser variability in
the DOM event model. That means we can't raise standard events that we'd fire through JSDOM.
Instead, we use the `ReactTestUtils.Simulate` object to raise events.

React offers a mechanism for setting default prop values, defaultProps, which will be used when required props are
not explicitly provided. `MyComponent.defaultProps = {required_prop: 'value'}`

Using a Jest matcher to simplify expectations \
expect(submitSpy).toHaveBeenCalled();
This is more descriptive than using a toBeDefined() argument on the matcher. It also encapsulates the notion
that if receivedArguments hasn't been set, then it hasn't been called.
```js
expect.extend({
  toHaveBeenCalled(received) {
    if (received.receivedArguments() === undefined) {
      return {
        pass: false,
        message: () => 'Spy was not called.'
      };
    }
    return { pass: true, message: () => 'Spy was called.' };
  }
});

expect(submitSpy).toHaveBeenCalled();
```
All Jest matchers must return an object with a pass property, which is either true or false, and a
message property, which is a function that returns a string.

To prepare a component for assertions, wrap the code rendering it and performing updates inside an `act()` call.
This makes your test run closer to how React works in the browser. There are two forms of act: a synchronous form and
an asynchronous form. So what does act do? It defers state updates until the entirety of the function passed to act
has completed. That helps to avoid timing issues. Second, it waits for any useEffect hook functions to complete.
The asynchronous version will wait for the runtime's task queue to complete execution. This means that anything that
occurs as a separate asynchronous task, such as a fetch request invoked from a useEffect hook, is guaranteed to have
completed by the time your expectations happen. \
The synchronous form of act does two things: first, it calls all useEffect hooks after it has rendered the provided
component. Second, it defers any state setters until after all effects have executed. We are using the first behavior
here.
```js
import ReactTestUtils, {act} from 'react-dom/test-utils';
await act(async () => { performSomeReactAction() });
act(() => {ReactDOM.render(<Counter />, container)});
act(() => {button.dispatchEvent(new MouseEvent('click', {bubbles: true}))});
```

Jest mock function - pretty powerful thing that helps you to mock your functions;
So we can stub out child components and use *spies* to assert that they were instantiated with the right props.

**container component** - This is a component whose purpose is simply to pull data together and pass
it on to another component. \
Why use a container component? \
We could add a useEffect hook straight into AppointmentForm. But if we did that, we'd then have two
methods for setting availableTimeSlots: the original prop and the new fetch call. Aligning the two
adds complication. Do we set the initial value to the prop and then overwrite it with the data 
from fetch? Or perhaps we should get rid of the prop entirely, in which case we'll need to
rewrite our tests to use a stubbed fetch response to set availableTimeSlots.

**shallow rendering (react-test-renderer package)** lets you render a component “one level deep”
and assert facts about what its render method returns, without worrying about the behavior of 
child components, which are not instantiated or rendered. This does not require a DOM. So it 
stops at all *custom* components. All primitives, such as div, ol, and table, will be rendered 
along with their children. The root shallow rendered component itself will have all of its hooks
and side effects run, so we can continue to test any kind of life cycle. \

React `props.children` can have different types: it can be an `object`, a `string` value,
an `array`, or it can even just `not defined` at all.


Why test React Router with shallow render?
If we use full render, we would lose information about which components were originally Link/Route
components. Instead, we'd simply see clickable DOM elements, so we couldn't even assert that the
right elements were displayed. \
The second reason is that you don't need to wrap your component under test in a Router. This is a
requirement of the Link, Route, and Switch components. While that is a wonderful feature at runtime,
in our tests it's simply noise. \
The spy doesn't actually trigger a page change. When we use shallow rendering, a Switch component won't do any
routing at all. We have to mimic that in our tests.

If you really want to see the Switch in action, you'll need to use mount to render your component.

*expect-redux* lib to test Redux interactions. This allows us to write tests that are not tied to redux-saga. 
This is a good thing! You could replace redux-saga with redux-thunk and your tests would still work.

Tests that returns a promise not always needed to be waited for. \
Jest is smart enough to know to wait if the test function returns a promise.
```js
it('sets current status to submitting', () => {
    dispatchRequest();
    return expectRedux(store)
      .toDispatchAnAction()
      .matching({type: 'ADD_CUSTOMER_SUBMITTING'});
});
```

`toDispatchAnAction()` from expect-redux checks that action was dispatched with following predicates, 
`toNotDispatchAnAction(timeout)` - checks that action was not dispatched during timeout (watch the timeout,
can be false positive result).  

**whatwg-fetch**
This package-polyfill allows us to use `window.fetch` when we are running some front end code that uses Browser API on
the Node backend, e.g. for testing purpose.
So *that below* code in you tests works we need `import 'whatwg-fetch'`;
```js
import 'whatwg-fetch';

jest.spyOn(window, 'fetch');
/* do some request */
expect(window.fetch).toHaveBeenCalledWith('/customers', {/*...*/});
```

Unlike with React Router, with Redux we generally prefer to use **full rendering** over shallow rendering. \
Unlike React Router, Redux isn't rendering components, so we don't need to assert that specific Redux components
are part of the React component instance graph. \
Redux actions perform a variety of user-defined operations when they are dispatched. We'd like to be able to run them
within our tests so that we can assert our interactions, it is different from the Router API, e.g. history prop,
which has fixed behavior. \
To test our components, we need to render each component wrapped in a `Provider` component.

Unfortunately, `spyOn` does not work with functions that are wrapped with the `connect` function. `connect` doesn't
return a function itself but instead, an object that React understands. So you cannot stub a component linked with redux
that easy:
```js
AppointmentFormSpy = jest.spyOn(AppointmentFormExports, 'AppointmentForm').mockReturnValue(null);

// But we can stub the component like this instead:
AppointmentFormExports.AppointmentForm = jest.fn(() => null);
```

### GraphQL
It offers an alternative mechanism for fetching data, but it's not just a drop-in replacement for the fetch API.
In providing a layer of abstraction above HTTP calls, it offers a whole bunch of additional features that can be added.

We'll use the bare-bones GraphQL `Relay` library to connect to our backend. \
```shell
npm i -E react-relay && npm i -DE babel-plugin-relay relay-compiler
```

You'll also need to update your .babelrc file to include the Babel plugin:
```json
{
  "presets": ["@babel/env", "@babel/react"],
  "plugins": ["@babel/transform-runtime", "relay"]
}
```

The core of Relay is the fetchQuery function. This function sends requests to your GraphQL endpoint.

Environment object requires a whole bunch of other Relay types to be constructed. These types come directly from the
`relay` package. In order to stub them out, we'll need to create a module mock with the jest.mock function.
This function is special in that it is hoisted to the top of the file and will replace all functions and classes
within that module before anything has a chance to load the file. At the same time, we also need to import all of
the original functions ourselves so that we can spy on them in our tests.

```js
import {
  Environment,
  Network,
  Store,
  RecordSource
} from 'relay-runtime';

jest.mock('relay-runtime');
```

Relay provides a `QueryRenderer` component that can call your GraphQL endpoint directly. This can sometimes be
a simpler, less complicated way of handling your data than using Redux, but since we're already using Redux for
all our data access.

Before use graphql - better use compiler to create queries:
```json
"relay": "relay-compiler --src ./src --schema ./src/schema.graphql --watchman false"
```

#### Cucumber
Cucumber package incorporates a special test runner that runs feature files, written in a plain-English language known
as **Gherkin**. These feature files are backed by support scripts that are written in JavaScript. Since Cucumber has
its own test runner, it doesn't use Jest, although we will make use of Jest's expect package. The Gherkin language is
a popular syntax for writing plain-language tests that help us collaborate with our whole team.
It translates into JavaScript code.

Within our support files, we'll use **Puppeteer** to drive a "real" web browser. Puppeteer drives only one web browser,
Google Chrome, but may not be enough for you if you're looking for cross-platform support.

To add the cucumber:
```shell
npm i -DE cucumber puppeteer expect @babel/register;

# To run only one feature
npx cucumber-js --require-module @babel/register features/drawing.feature:5
```
