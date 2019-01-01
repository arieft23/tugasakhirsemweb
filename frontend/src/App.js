import React, { Component } from 'react';
import { BrowserRouter, Route } from "react-router-dom";
import logo from './logo.svg';
import './App.css';

import IndexPage from './component/index';

class App extends Component {
  render() {
    return (
      <BrowserRouter>
        <div className="App">
          <Route exact path="/" component={IndexPage} />
        </div>
      </BrowserRouter>
    );
  }
}

export default App;
