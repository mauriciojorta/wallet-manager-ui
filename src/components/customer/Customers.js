import React, { Component } from 'react';
import { Link } from 'react-router-dom';

import Spinner from '../layout/Spinner';

import WalletManagerApi from '../../api/WalletManagerAPI';

class Customers extends Component {
  state = {
    customers: []
  };

  componentDidMount() {
    WalletManagerApi.getAllCustomers()
    .then(res => res.json())
    .then((data) => {
      this.setState({ customers: data })
    })
    .catch(console.log)
  }


  render() {
    if (this.state.customers) {
      return (
        <div>
          <div className="row">
            <div className="col-md-6">
              <h2>
                {' '}
                <i className="fas fa-users" /> Customers{' '}
              </h2>
            </div>
          </div>

          <table className="table table-striped">
            <thead className="thead-inverse">
              <tr>
                <th>Name</th>
                <th>Surname</th>
                <th>Email</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {this.state.customers.map(customer => (
                <tr key={customer.id}>
                  <td>
                    {customer.name} 
                  </td>
                  <td>{customer.surname}</td>
                  <td>{customer.email}</td>
                  <td>
                    <Link
                      to={`/wallets/?email=${customer.email}`}
                      className="btn btn-secondary btn-sm"
                    >
                      <i className="fas fa-wallet" /> Wallets
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    } else {
      return <Spinner />;
    }
  }
}


export default Customers;
