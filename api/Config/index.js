const HDWalletProvider = require('truffle-hdwallet-provider');
const Web3 = require('web3');

module.exports = {
  BASE_URL_DEV: 'http://localhost:3000',
  BASE_URL_PROD: 'https://alpha.iku.network',
  GOOGLE_CAPTCHA_VERIFY_URL: 'https://www.google.com/recaptcha/api/siteverify',
  FROM_EMAIL: 'noreply@iku.network',
  RST_ACTIVATION_THRESHOLD: 1,
  RST_DEFAULT_RATE: 1000,
  RST_DEFAULT_DECIMALS: 18,
  RST_ACCESS_DATA_THRESHOLD: 0,
  RST_ACCESS_LICENSE_THRESHOLD: 1,
  IPFS_HOST: 'ipfs.infura.io',
  IPFS_PORT: '5001',
  getProvider: () => {
    const network = process.env.CURRENT_NETWORK;
    if (network !== 'development') {
      const key = process.env.INFURA_KEY;
      return new HDWalletProvider(
        process.env.IKU_ACCOUNT_MNEMONIC,
        `https://${network}.infura.io/${key}`,
        1
      );
    }

    return new Web3.providers.HttpProvider('http://localhost:9545');
  },
};
