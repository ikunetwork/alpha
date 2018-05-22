const DB = require('../api/Database');

console.log('POPULATING user TABLE...');

const users = [
  {
    id: 5,
    address: '0xa8ec8c78c00cb0653f0394c81a1791317c73dc32',
    signature:
      '0x242ca3f0eca5514ce421b6e24bfbbded52403d774f58243b4b6f1a072d4b4b6d2f18c2f34ad176d954b8a17b3c5a051b91247aab7c3193854030916d00e7173b1b',
    first_name: 'Creator',
    last_name: 'Test',
    email: 'bruno@iku.network',
    username: 'creator',
    organization: 'iku.network',
    verified: true,
  },
];

users.forEach(user => {
  DB.insert('user', user);
});

console.log('DONE');
