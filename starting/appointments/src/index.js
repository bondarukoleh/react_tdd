import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom';
import 'whatwg-fetch';
import './styles.css';
import {App} from "./App";
import {createBrowserHistory} from 'history';
import {Provider} from 'react-redux';
import {configureStore} from './store';

ReactDOM.render(
  <Provider store={configureStore()}>
    <Router history={createBrowserHistory()}>
      <App/>
    </Router>
  </Provider>,
  document.getElementById('root')
);
