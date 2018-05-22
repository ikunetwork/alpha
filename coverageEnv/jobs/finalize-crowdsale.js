const DB = require('../api/Database');
const config = require('../api/Config');

const TABLE_NAME = 'proposal';

const Web3 = require('web3');
const Contract = require('truffle-contract');
const RSTCrowdsale = require('../build/contracts/RSTCrowdsale.json');

// TODO - Move this to it's own class
const jobId = Date.now();
const logPrefix = `"finalize-crowdsale-job ::: ${jobId} ::: `;

function jobLog(...args) {
  console.log.apply(console, [logPrefix, ...args]);
}

module.exports = {
  run: _ => {
    jobLog('run() ::: ', process.env.CURRENT_NETWORK);

    const provider = config.getProvider();
    const web3 = new Web3(provider);

    const contract = Contract(RSTCrowdsale);
    contract.setProvider(provider);

    web3.eth.getAccounts((err, accounts) => {
      if (err != null) {
        jobLog('There was an error fetching your accounts.', err);
        return;
      }

      if (accounts.length === 0) {
        jobLog(
          "Couldn't get any accounts! Make sure your Ethereum client is configured correctly."
        );
        return;
      }

      const baseAccount = accounts[0];

      jobLog('Using account: ', baseAccount);

      web3.eth.getBlock('latest', (_err, block) => {
        if (_err) {
          jobLog("Couldn't get the latest block");
          return false;
        }
        // EVM "now" + 1 minute
        const now = block.timestamp;

        DB.query(
          `SELECT * FROM "${TABLE_NAME}" WHERE approved=TRUE AND finalized=FALSE AND locked=FALSE AND start_time > 0 AND end_time < ${now}`
        ).then(res => {
          const items = res.rows;
          jobLog('PROPOSALS FOUND:', items.length);

          items.forEach(proposal => {
            DB.update(TABLE_NAME, { locked: true }, proposal.id)
              .then(__ => {
                jobLog('proposal locked in the db');

                let contractInstance;

                jobLog('starting with ', proposal.id, proposal.address);

                contract.at(proposal.address).then(instance => {
                  contractInstance = instance;
                  jobLog('Got contract instance');
                  return contractInstance
                    .finalize({
                      from: baseAccount,
                    })
                    .then(r => {
                      jobLog('Contract finalized!', r);

                      // Here we should update the db
                      // and store the transaction that called finalize
                      // So we show proof that the funds were transferred

                      contractInstance
                        .goalReached()
                        .then(goalReached => {
                          jobLog('Goal reached?', goalReached);

                          const data = {
                            finalized: true,
                            locked: false,
                          };

                          if (goalReached) {
                            data.goal_reached = true;
                            data.funds_transfer_tx = r.tx;
                          }

                          DB.update(TABLE_NAME, data, proposal.id)
                            .then(___ => {
                              jobLog('proposal finalized updated in the db');
                            })
                            .catch(____err => {
                              jobLog(
                                'Error updating proposal in DB after finalized',
                                ____err
                              );
                            });
                        })
                        .catch(e => {
                          jobLog('Error while finalizing contract'.e);
                        });
                    });
                });
              })
              .catch(___err => {
                jobLog('Error updating proposal in DB after finalized', ___err);
              });
          });
        });
      });
    });
  },
};
