import Web3 from 'web3';
import ethUtil from 'ethereumjs-util';
import sigUtil from 'eth-sig-util';

export default class Web3Helper {
  static getNetwork(network_id) {
    let network;

    switch (network_id) {
      case '1':
        network = 'Main Network';
        break;
      case '2':
        network = 'Morden Testnet';
        break;
      case '3':
        network = 'Ropsten Testnet';
        break;
      case '4':
        network = 'Rinkeby Testnet';
        break;
      case '42':
        network = 'Kovan Testnet';
        break;
      default:
        network = 'Private Network';
    }

    return network;
  }

  static getWeb3() {
    return new Promise((resolve, reject) => {
      // Don't wait for window load if web3 is already available
      if (typeof window.web3 !== 'undefined') {
        // Use Mist/MetaMask's provider.
        const results = {
          web3: new Web3(window.web3.currentProvider),
        };

        resolve(results);
      }

      // Wait for loading completion to avoid race conditions with web3 injection timing.
      window.addEventListener('load', () => {
        let results;
        const { web3 } = window;

        // Checking if Web3 has been injected by the browser (Mist/MetaMask)
        if (typeof web3 !== 'undefined') {
          // Use Mist/MetaMask's provider.
          results = {
            web3: new Web3(web3.currentProvider),
          };

          resolve(results);
        } else {
          reject({ error: 'no web3 support found' });

          // In the future maybe we could implement
          // a fallback strategy  like this
          // (local node / hosted node + in-dapp id mgmt / fail)

          // const provider = new Web3.providers.HttpProvider(
          //   'http://localhost:8545'
          // );

          // results = {
          //   web3: new Web3(provider),
          // };

          // resolve(results);
        }
      });
    });
  }

  static signMessage(address, web3) {
    return new Promise((resolve, reject) => {
      const text =
        'By clicking on "Sign" you agree to the terms of iku.network';
      const msg = ethUtil.bufferToHex(Buffer.from(text, 'utf8'));
      const from = address;
      const params = [msg, from];
      const method = 'personal_sign';
      web3.currentProvider.sendAsync(
        {
          method,
          params,
          from,
        },
        (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          }

          if (result.error) {
            console.error(result.error);
            reject(result.error);
          }

          const msgParams = { data: msg };
          msgParams.sig = result.result;

          const recovered = sigUtil.recoverPersonalSignature(msgParams);

          if (recovered === from) {
            resolve(result.result);
          } else {
            console.dir(recovered);
            console.log(
              `SigUtil Failed to verify signer when comparing ${
                recovered.result
              } to ${from}`
            );
            console.log('Failed, comparing %s to %s', recovered, from);
            reject({ error: 'Failed to verify signer' });
          }
        }
      );
    });
  }
}
