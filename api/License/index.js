const Web3 = require('web3');
const Contract = require('truffle-contract');
const config = require('../Config');
const IkuToken = require('../../build/contracts/IkuToken.json');

const provider = config.getProvider();
const web3 = new Web3(provider);

class License {
  static put(uri) {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, accounts) => {
        if (err !== null) {
          console.log('There was an error fetching your accounts.', err);
          return;
        }

        if (accounts.length === 0) {
          console.log(
            "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
          );
          return;
        }

        const token = Contract(IkuToken);
        token.setProvider(provider);
        const baseAccount = accounts[0];

        // Declaring this for later so we can chain functions.
        let tokenInstance;

        token
          .deployed()
          .then(async instance => {
            tokenInstance = instance;
            await tokenInstance.setTokenURI(uri, { from: baseAccount });
            resolve({ tokenURI: uri });
          })
          .catch(e => {
            reject({ message: e.message });
          });
      });
    });
  }

  static get(req) {
    return new Promise((resolve, reject) => {
      web3.eth.getAccounts((err, accounts) => {
        if (err !== null) {
          console.log('There was an error fetching your accounts.', err);
          return;
        }

        if (accounts.length === 0) {
          console.log(
            "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
          );
          return;
        }

        const token = Contract(IkuToken);
        token.setProvider(provider);

        // Declaring this for later so we can chain functions.
        let tokenInstance;

        token
          .deployed()
          .then(async instance => {
            tokenInstance = instance;
            const tokenURI = await tokenInstance.tokenURI();
            resolve({ tokenURI });
          })
          .catch(e => {
            reject({ message: e.message });
          });
      });
    });
  }
}

module.exports = License;
