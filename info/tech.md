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
