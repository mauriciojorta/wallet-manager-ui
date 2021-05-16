import React from 'react';
import AppNavBar from './components/layout/AppNavbar';
import Dashboard from './components/layout/Dashboard';
import './App.css';
import { Route, Switch } from 'react-router';
import { BrowserRouter as Router } from 'react-router-dom';
import Wallets from './components/wallet/Wallets';
import Transfer from './components/transfer/Transfer';

function App() {
  return (
    <Router>
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
    </Router>

  );
}

export default App;
