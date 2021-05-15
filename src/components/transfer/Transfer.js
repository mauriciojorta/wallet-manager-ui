import React, { Component } from 'react'

import WalletManagerApi from '../../api/WalletManagerAPI';
import Select from 'react-select';
import AsyncSelect from 'react-select'

import CurrencyInput from 'react-currency-input-field';

import { Link } from 'react-router-dom';

const initialFormValues = {
    senderOptions: [],
    senderWalletOptions: [],
    recipientOptions: [],
    recipientWalletOptions: [],
    sender: { label: 'Select sender', value: '' },
    senderHash: { label: 'Select wallet', value: '' },
    senderWalletFunds: "0.00",
    recipient: { label: 'Select recipient', value: '' },
    recipientHash: { label: 'Select wallet', value: '' },
    transferFunds: "0.00"
}

const validationFlags = {
    senderSelected: false,
    senderWalletSelected: false,
    recipientSelected: false,
    recipientWalletSelected: false,
    fundsGreaterThanCurrentBalance: false,
    negativeFunds: false
}

const resultFlags = {
    invalidForm: false,
    transferSuccess: false,
    transferError: false
}
export default class Transfer extends Component {

    state = {
        ...initialFormValues,

        ...validationFlags,

        ...resultFlags

    };


    componentDidMount() {
        const params = new URLSearchParams(this.props.location.search);
        const email = params.get('email');
        const wallet = params.get('wallet');

        let customerOptions = {};

        WalletManagerApi.getAllCustomers()
            .then(res => res.json())
            .then((data) => {
                const options = data.map(customer => { return { value: customer.email, label: customer.email } });
                customerOptions = options;
                if (email && wallet) {
                    WalletManagerApi.getWalletsOfCustomer(email)
                        .then(res => res.json())
                        .then((data) => {
                            const options = data.map(wallet => { return { value: (wallet.hash), label: wallet.hash + ' - ' + wallet.balance + ' €' } });
                            const walletFromParam = options.filter(walletOption => walletOption.value === wallet);
                            this.setState({
                                sender: { label: email, value: email },
                                senderSelected: true,
                                senderWalletOptions: options,
                                senderHash: walletFromParam[0],
                                senderWalletFunds: walletFromParam[0].label.split(/[ -]+/)[1],
                                senderWalletSelected: true,
                                recipientOptions: customerOptions
                            });
                        })
                } else {
                    this.setState({ senderOptions: options, recipientOptions: options });
                }
            })
            .catch(console.log)
    }

    getCustomerWallets = (email, isSender) => {
        WalletManagerApi.getWalletsOfCustomer(email)
            .then(res => res.json())
            .then((data) => {
                const options = data.map(wallet => { return { value: (wallet.hash), label: wallet.hash + ' - ' + wallet.balance + ' €' } });
                if (isSender) {
                    this.setState({ sender: { label: email, value: email }, senderSelected: true, senderWalletOptions: options, senderHash: initialFormValues.senderHash, senderWalletSelected: false });

                } else {
                    this.setState({ recipient: { label: email, value: email }, recipientSelected: true, recipientWalletOptions: options, recipientHash: initialFormValues.recipientHash, recipientWalletSelected: false });
                }
            })
    }

    validateFunds = (amount) => {
        this.setState({ transferFunds: amount });

        let negativeFunds = false;
        let fundsGreaterThanCurrentBalance = false;
        if (amount) {
            if (amount < 0) {
                negativeFunds = true;
            }

            const parsedAmount = amount.replace(",", ".");

            if (parseFloat(parseFloat(this.state.senderWalletFunds).toFixed(2)) - parseFloat(parseFloat(parsedAmount).toFixed(2)) < 0) {
                fundsGreaterThanCurrentBalance = true;
            }

            this.setState({ negativeFunds: negativeFunds, fundsGreaterThanCurrentBalance: fundsGreaterThanCurrentBalance });

        }
    }

    resetFunds = () => {
        this.setState({ transferFunds: "0.00", negativeFunds: false, fundsGreaterThanCurrentBalance: false });
    }

    selectSenderWallet = (wallet) => {
        this.resetFunds();

        const walletParts = wallet.split(/[ -]+/);
        this.setState({ senderHash: { label: wallet, value: walletParts[0] }, senderWalletSelected: true, senderWalletFunds: walletParts[1] });
    }

    selectRecipientWallet = (wallet) => {
        const walletParts = wallet.split(/[ -]+/);
        this.setState({ recipientHash: { label: wallet, value: walletParts[0] }, recipientWalletSelected: true });
    }

    validateForm = () => {
        let formIsInvalid = false

        if (!this.state.senderSelected || !this.state.recipientSelected) {
            formIsInvalid = true;
        }

        if (!this.state.senderWalletSelected || !this.state.recipientWalletSelected) {
            formIsInvalid= true;
        }

        if (!this.state.senderWalletSelected || !this.state.recipientWalletSelected) {
            formIsInvalid = true;
        }

        if (this.state.negativeFunds || this.state.fundsGreaterThanCurrentBalance) {
            formIsInvalid = true;
        }

        if (this.state.senderHash.value === this.state.recipientHash.value) {
            formIsInvalid = true;
        }

        this.setState( {invalidForm: formIsInvalid });
    }

    transferFunds = (e) => {
        e.preventDefault();
        this.validateForm();
        if (!this.state.invalidForm) {
            WalletManagerApi.transferFunds(this.state.senderHash.value, this.state.recipientHash.value, this.state.transferFunds.replace(",", "."))
                .then(res => {
                    if (res.status === 200) {
                        this.resetFormValues();
                        this.setState({ transferSuccess: true, transferError: false });
                        WalletManagerApi.getAllCustomers()
                            .then(res => res.json())
                            .then((data) => {
                                const options = data.map(customer => { return { value: customer.email, label: customer.email } });
                                this.setState({ senderOptions: options, recipientOptions: options });
                            })
                            .catch(console.log)
                    } else {
                        this.setState({ transferError: true });
                    }
                });
        } else {
            this.setState(this.state)
        }

    }

    resetFormValues = () => {
        this.setState({ ...initialFormValues });
    }

    render() {
        if (this.state.senderOptions) {
            return (
                <div>
                    {this.state.invalidForm ?
                        <div className="alert alert-danger" role="alert">
                            Invalid form fields. Please check your input.
                     </div> : null}

                    {this.state.transferSuccess ?
                        <div className="alert alert-success" role="alert">
                            Transfer successfull!
                     </div> : null}

                    {this.state.transferError ?
                        <div className="alert alert-danger" role="alert">
                            Transfer failed. An error occurred!
                     </div> : null}
                    <div className="row">
                        <div className="col-md-4">
                            <h2>
                                <i className="fas fa-exchange-alt"></i> Transfer 
                            </h2>
                        </div>
                    </div>
                    <form onSubmit={this.transferFunds}>
                        <div className="form-group">
                            <label htmlFor="sender">Select sender</label>
                            <Select
                                name="sender"
                                value={this.state.sender}
                                options={this.state.senderOptions}
                                onChange={(selection, action) => this.getCustomerWallets(selection.value, true)} />

                            {!this.state.senderSelected ?
                                <div className="text-danger">
                                    You must select a sender.
                                    </div> : null
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="senderWallet">Select wallet of sender</label>
                            <AsyncSelect
                                name="senderWallet"
                                defaultValue={{ label: "Select wallet", value: "" }}
                                value={this.state.senderHash}
                                options={this.state.senderWalletOptions}
                                onChange={(selection, action) => this.selectSenderWallet(selection.label)} />
                            {!this.state.senderWalletSelected ?
                                <div className="text-danger">
                                    You must select a sender wallet.
                                </div> : null
                            }
                        </div>

                        <br></br>

                        <div className="form-group">
                            <label htmlFor="funds">Select funds to transfer</label>
                            <CurrencyInput
                                id="funds"
                                name="funds"
                                placeholder="Please enter a number"
                                className={`form-control`}
                                prefix="€"
                                defaultValue={0}
                                value={this.state.transferFunds}
                                onValueChange={(value, name) => this.validateFunds(value)}
                                decimalsLimit={2}
                            />

                            {this.state.negativeFunds ?
                                <div className="text-danger">
                                    You must enter a positive number!
                                </div> : null
                            }


                            {this.state.senderHash && this.state.fundsGreaterThanCurrentBalance ?
                                <div className="text-danger">
                                    You are trying to transfer more than what the wallet holds!
                                </div> : null
                            }

                        </div>

                        <br></br>
                        <br></br>

                        <div className="form-group">
                            <label htmlFor="recipient">Select recipient</label>
                            <AsyncSelect
                                name="recipient"
                                defaultValue={{ label: "Select recipient", value: "" }}
                                value={this.state.recipient}
                                options={this.state.recipientOptions}
                                onChange={(selection, action) => this.getCustomerWallets(selection.value, false)} />

                            {!this.state.recipientSelected ?
                                <div className="text-danger">
                                    You must select a recipient.
                                    </div> : null
                            }
                        </div>
                        <div className="form-group">
                            <label htmlFor="recipient">Select wallet of recipient</label>
                            <AsyncSelect
                                name="recipientWallet"
                                value={this.state.recipientHash}
                                options={this.state.recipientWalletOptions}
                                onChange={(selection, action) => this.selectRecipientWallet(selection.label)} />
                            {!this.state.recipientWalletSelected ?
                                <div className="text-danger">
                                    You must select a recipient wallet.
                                </div> : null
                            }
                            {this.state.senderHash.value !== "" && this.state.senderHash.value === this.state.recipientHash.value ?
                                <div className="text-danger">
                                    You can't transfer funds to a same wallet!
                                </div> : null
                            }
                        </div>
                        <br></br>
                        <button className="btn btn-primary" type="submit">Send transfer</button>
                        <Link to="/">
                            <button className="btn btn-secondary" >Back</button>
                        </Link>
                    </form>
                </div>
            )
        }
    }
}
