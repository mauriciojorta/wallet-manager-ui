import React, { Component } from 'react';
import Spinner from '../layout/Spinner';

import WalletManagerAPI from '../../api/WalletManagerAPI';

import { Link } from 'react-router-dom';


export default class Wallets extends Component {
    state = {
        wallets: [],
        email: ''
    };

    componentDidMount() {

        const params = new URLSearchParams(this.props.location.search); 
        const email = params.get('email');
        WalletManagerAPI.getWalletsOfCustomer(email)
            .then(res => res.json())
            .then((data) => {
                this.setState({ wallets: data, email: email})
            })
            .catch(console.log)
    }

    render() {
        if (this.state.wallets) {
        return (
            <div>
          <div className="row">
            <div className="col-md-6">
              <h2>
                {' '}
                <i className="fas fa-wallet" /> Wallets of {this.state.email}
              </h2>
            </div>
          </div>
            {this.state.wallets.map(wallet => (
                <div key={wallet.hash} className="card border-primary mb-3">
                    <div className="card-header">{wallet.name}</div>
                    <div className="card-body text-primary">
                        <h5 className="card-title">Hash</h5>
                        <p className="card-text">{wallet.hash}</p>
                    </div>
                    <div className="card-footer">
                      <div className="row">
                        <div className="col-md-6">
                          Balance: {wallet.balance} €
                        </div>
                        <div className="col-md-6">
                        <Link to={`/transfer/?email=${this.state.email}&wallet=${wallet.hash}`}>
                          <button type="button" className="btn btn-primary">Make a transfer</button>
                          </Link>
                        </div>
                      </div>
                      </div>
                </div>
              ))}
          </div>
        );
        } else {
            return <Spinner />;
        }
    }
}
