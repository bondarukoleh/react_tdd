import React from 'react';
import ReactDOM from 'react-dom';
import {BrowserRouter as Router} from 'react-router-dom'
import 'whatwg-fetch';
import './styles.css'
import {App} from "./App";
import {createBrowserHistory} from 'history';

ReactDOM.render(
  <Router history={createBrowserHistory()}>
    <App/>
  </Router>,
  document.getElementById('root')
);
