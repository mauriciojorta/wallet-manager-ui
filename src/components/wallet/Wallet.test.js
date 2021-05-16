import React from 'react';
import { render, screen } from '@testing-library/react';
import Wallets from './Wallets';
import { BrowserRouter as Router } from 'react-router-dom';
import WalletManagerAPI from '../../api/WalletManagerAPI'

// Custom mock of WalletManagerAPI request to simulate in this test
WalletManagerAPI.getWalletsOfCustomer = (email) => Promise.resolve(
    { json: () => Promise.resolve([{ name: 'Wallet', hash: '506c8b894ea86a36b20ca47e155f687734dee3c1b701a136478a09d5b5497dd4', balance: 100.00 }]) }

);

test('Wallets page renders without crashing', async () => {

    const routeComponentPropsMock = { search: '?email=mikem@email.com' };

    const { getByText } = render(
        <Router>
            <Wallets location={routeComponentPropsMock} />
        </Router>);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(getByText(/^506c8b894ea86a36b20ca47e155f687734dee3c1b701a136478a09d5b5497dd4$/i)).toBeInTheDocument();


});

