import config from "../config/config.json";

const findAllCustomers = () => {
    return fetch(config.API_URL + '/customers');
}

const findWalletsOfCustomer = (email) => {
    return fetch(config.API_URL + '/wallets?email=' + email);
}

const transferFundBetweenWallets = (senderHash, recipientHash, funds) => {
    const requestBody = {
        senderHash: senderHash,
        recipientHash: recipientHash,
        funds: funds
    }

    return fetch(config.API_URL + '/wallets/transfer', {
        method: 'PUT',
        body: JSON.stringify(requestBody), 
        headers:{
          'Content-Type': 'application/json'
        }
      });
}

const WalletManagerAPI = {
    getAllCustomers: findAllCustomers,
    getWalletsOfCustomer: findWalletsOfCustomer,
    transferFunds: transferFundBetweenWallets
};

export default WalletManagerAPI; 