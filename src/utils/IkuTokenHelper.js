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
          reject({ message: e.message });
        });
    });
  }

  static getLicense(provider) {
    return new Promise((resolve, reject) => {
      const token = Contract(IkuToken);
      token.setProvider(provider);

      // Declaring this for later so we can chain functions.
      let tokenInstance;

      token
        .deployed()
        .then(async instance => {
          console.log('got instance', instance);
          tokenInstance = instance;
          const tokenURI = await tokenInstance.tokenURI();
          console.log('got tokenURI', tokenURI);
          const reqBody = await fetch(tokenURI);
          const body = await reqBody.json();
          console.log('fetch?', body);
          resolve(body);
        })
        .catch(e => {
          reject({ message: e.message });
        });
    });
  }
}
