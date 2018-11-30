import 'babel-polyfill';
import React, { Component } from 'react';
import './App.css';
import Job  from './Component/Job/Job';
class App extends Component {
  render() {
    return (
      <div className="App">
        <Job></Job>
      </div>
    );
  }
}

export default App;
