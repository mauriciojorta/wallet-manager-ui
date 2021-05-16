import React from 'react';
import { render } from '@testing-library/react';
import App from './App';
import WalletManagerAPI from './api/WalletManagerAPI'

// Custom mock of WalletManagerAPI request to simulate in this test
WalletManagerAPI.getAllCustomers = () => Promise.resolve(
    { json: () => Promise.resolve([{ name: 'Mike', surname: 'Mays', email: "mikem@email.com" }]) }

);

test('App page renders without crashing', async () => {
  const { getByText } = render(
      <App />
  );

  await new Promise(resolve => setTimeout(resolve, 100));

  expect(getByText(/^mikem@email.com$/i)).toBeInTheDocument();

});
