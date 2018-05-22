import Contract from 'truffle-contract';
import IkuToken from '../../build/contracts/IkuToken.json';

export default class IkuTokenHelper {
  static getBalance(provider, address) {
    return new Promise((resolve, reject) => {
      const token = Contract(IkuToken);
      token.setProvider(provider);

      // Declaring this for later so we can chain functions.
      let tokenInstance;

      token
        .deployed()
        .then(instance => {
          tokenInstance = instance;
          resolve(tokenInstance.balanceOf.call(address));
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}
