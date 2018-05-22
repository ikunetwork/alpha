const Web3 = require('web3');
const Contract = require('truffle-contract');
const config = require('../Config');
const IkuToken = require('../../build/contracts/IkuToken.json');

const provider = config.getProvider();
const web3 = new Web3(provider);

class Faucet {
  static sendTokens(req) {
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

        const baseAccount = accounts[0];

        const token = Contract(IkuToken);
        token.setProvider(provider);

        // Declaring this for later so we can chain functions.
        let tokenInstance;

        token
          .deployed()
          .then(instance => {
            tokenInstance = instance;
            const account_from = baseAccount;
            const account_to = req.body.address;
            const amount = new web3.BigNumber(100 * 10 ** 18);

            console.log(account_from, account_to, amount);

            tokenInstance
              .transfer(account_to, amount, {
                from: account_from,
                gas: 4500000,
              })
              .then(transfer => {
                console.log('TRANSFER!', transfer);
                resolve(transfer);
              })
              .catch(e => {
                console.log('REJECT', reject);
                reject(e);
              });
          })
          .catch(e => {
            reject(e);
          });
      });
    });
  }
}

module.exports = Faucet;
