// @flow

import * as React from 'react';
import { BrowserRouter, Switch, Route } from 'react-router-dom';

import HomePage from './home/HomePage';
import CalcPage from './calc/CalcPage';

import logo from '../images/logo.svg';
import './App.scss';

export default function App(): React.Node {
  return (
    <BrowserRouter>
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            Edit <code>src/App.js</code> and save to reload.
          </p>
          <a
            className="App-link"
            href="https://reactjs.org"
            target="_blank"
            rel="noopener noreferrer"
          >
            Learn React
          </a>
        </header>

        <Switch>
          <Route path="/calc">
            <CalcPage />
          </Route>
          <Route path="/">
            <HomePage />
          </Route>
        </Switch>
      </div>
    </BrowserRouter>
  );
}
