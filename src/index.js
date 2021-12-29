// @flow

import nullthrows from 'nullthrows';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import './index.scss';

import App from './components/App';
import CalcPage from './components/calc/CalcPage';
import HomePage from './components/home/HomePage';
import reportWebVitals from './modules/reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<HomePage />} />
          <Route path="/calc" element={<CalcPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  </React.StrictMode>,
  nullthrows(document.getElementById('root')),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
