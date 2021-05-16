import React from 'react';
import { render, screen } from '@testing-library/react';
import Customers from './Customers';
import { BrowserRouter as Router } from 'react-router-dom';
import WalletManagerAPI from '../../api/WalletManagerAPI'

// Custom mock of WalletManagerAPI request to simulate in this test
WalletManagerAPI.getAllCustomers = () => Promise.resolve(
    { json: () => Promise.resolve([{ name: 'Mike', surname: 'Mays', email: "mikem@email.com" }]) }

);


test('Customer page renders without crashing', async () => {

    const { getByText } = render(
        <Router>
            <Customers />
        </Router>);

    await new Promise(resolve => setTimeout(resolve, 100));

    expect(getByText(/^mikem@email.com$/i)).toBeInTheDocument();


});