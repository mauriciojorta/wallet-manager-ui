import React, { Component } from 'react';
import { Link } from 'react-router-dom';

class AppNavbar extends Component {
  state = {
  };


  render() {

    return (
      <nav className="navbar navbar-expand-md navbar-dark bg-primary mb-4">
        <div className="container">
          <Link to="/" className="navbar-brand">
            Wallet-Manager
          </Link>
          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarMain"
          >
            <span className="navbar-toggler-icon" />
          </button>
          <div className="collapse navbar-collapse" id="navbarMain">
            <ul className="navbar-nav mr-auto">
                <li className="nav-item">
                  <Link to="/" className="nav-link">
                    Dashboard
                  </Link>
                </li>
                <li className="nav-item">
                  <Link to="/transfer" className="nav-link">
                    Transfer
                  </Link>
                </li>
            </ul>
          </div>
        </div>
      </nav>
    );
  }
}

export default AppNavbar;
