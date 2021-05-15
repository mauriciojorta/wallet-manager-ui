import React from 'react';
import AppNavBar from './components/layout/AppNavbar';
import Dashboard from './components/layout/Dashboard';
import './App.css';
import { Route, Switch } from 'react-router';
import Wallets from './components/wallet/Wallets';
import Transfer from './components/transfer/Transfer';

function App() {
  return (
    <div className="App">
      <AppNavBar />
      <div className="container">
        <Switch>
          <Route exact path ="/" component={Dashboard} />
        </Switch>
        <Switch>
          <Route exact path ="/customers" component={Dashboard} />
        </Switch>
        <Switch>
          <Route exact path ="/wallets" component={Wallets} />
        </Switch>
        <Switch>
          <Route exact path ="/transfer" component={Transfer} />
        </Switch>
      </div>
    </div>
  );
}

export default App;
