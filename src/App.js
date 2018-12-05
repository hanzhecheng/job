import 'babel-polyfill';
import React, { Component } from 'react';
import Loadable from 'react-loadable';
import './App.css';
import Loading from '@/Component/Loading/Index'
const Job = Loadable({
  loader: () => import('@/Component/Job/Job'),
  loading: Loading
});
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
