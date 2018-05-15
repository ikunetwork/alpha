require('babel-register');

const config = require('./api/Config');

module.exports = {
  migrations_directory: './migrations',
  networks: {
    development: {
      host: '127.0.0.1',
      port: 8545,
      network_id: '*', // Match any network id
      gas: 9000000,
    },
    coverage: {
      host: '127.0.0.1',
      network_id: '*', // eslint-disable-line camelcase
      port: 8555,
      gas: 0xfffffffffff,
      gasPrice: 0x01,
    },
    ropsten: {
      provider: config.getProvider(),
      network_id: 3,
      gas: 4500000,
    },
  },
};
