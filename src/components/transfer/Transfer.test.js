import React from 'react';
import { render, screen } from '@testing-library/react';
import Transfer from './Transfer';
import { BrowserRouter as Router } from 'react-router-dom';
import WalletManagerAPI from '../../api/WalletManagerAPI'

// Custom mocks of WalletManagerAPI request to simulate in this test
WalletManagerAPI.getWalletsOfCustomer = (email) => Promise.resolve(
    { json: () => Promise.resolve([{ name: 'Wallet', hash: '506c8b894ea86a36b20ca47e155f687734dee3c1b701a136478a09d5b5497dd4', balance: 100.00 }]) }

);

WalletManagerAPI.getAllCustomers = () => Promise.resolve(
    { json: () => Promise.resolve([{ name: 'Mike', surname: 'Mays', email: "mikem@email.com" }]) }

);

test('Transfer page renders without crashing', async () => {

    const routeComponentPropsMock = { search: '?email=mikem@email.com&wallet=506c8b894ea86a36b20ca47e155f687734dee3c1b701a136478a09d5b5497dd4' };

    const { getByText } = render(
        <Router>
            <Transfer location={routeComponentPropsMock}/>
        </Router>);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(getByText(/^mikem@email.com$/i)).toBeInTheDocument();


});