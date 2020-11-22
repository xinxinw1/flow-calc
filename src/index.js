// @flow

import React from 'react';
import ReactDOM from 'react-dom';

import nullthrows from 'nullthrows';

import './index.scss';

import App from './components/App';
import reportWebVitals from './modules/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  nullthrows(document.getElementById('root')),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
