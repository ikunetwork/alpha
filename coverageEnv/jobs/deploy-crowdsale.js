const DB = require('../api/Database');
const config = require('../api/Config');

const TABLE_NAME = 'proposal';
const TABLE_NAME_USER = 'user';
const Sendgrid = require('../api/Sendgrid');

const Web3 = require('web3');
const Contract = require('truffle-contract');
const RSTCrowdsale = require('../build/contracts/RSTCrowdsale.json');
const ResearchSpecificToken = require('../build/contracts/ResearchSpecificToken.json');

// TODO - Move this to it's own class
const jobId = Date.now();
const logPrefix = `"deploy-crowdsale-job ::: ${jobId} ::: `;

function jobLog(...args) {
  console.log.apply(console, [logPrefix, ...args]);
}

function deployToken(web3, provider, base_account, proposal) {
  const { decimals, token_name, token_symbol, token_address } = proposal;

  return new Promise((resolve, reject) => {
    const token = Contract(ResearchSpecificToken);
    token.setProvider(provider);
    token.defaults({
      from: base_account,
    });
    // It was already deployed
    if (token_address) {
      return token
        .at(token_address)
        .then(instance => {
          resolve(instance);
        })
        .catch(e => {
          jobLog('error getting token instance at ', token_address);
          reject(e);
        });
    } else {
      jobLog('DEPLOYING TOKEN ', decimals, token_name, token_symbol);

      const dataToken = {};
      if (process.env.CURRENT_NETWORK === 'development') {
        dataToken.gas = 6000000;
      }

      // Deploy the token
      token
        .new(decimals, token_name, token_symbol, dataToken)
        .then(tokenInstance => {
          jobLog('TOKEN HAS BEEN DEPLOYED', tokenInstance.address);
          DB.update(
            TABLE_NAME,
            { token_address: tokenInstance.address },
            proposal.id
          )
            .then(res => {
              jobLog('token address stored in db');
              resolve(tokenInstance);
            })
            .catch(____err => {
              jobLog('Error updating token address', ____err);
            });
        })
        .catch(e => {
          jobLog('Error deploying token', e);
          reject(e);
        });
    }
  });
}

module.exports = {
  run: _ => {
    jobLog('run() ::: ', process.env.CURRENT_NETWORK);

    const provider = config.getProvider();
    const web3 = new Web3(provider);

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

      const base_account = accounts[0];

      jobLog('Using account: ', base_account);

      DB.query(
        `SELECT * FROM (SELECT p.*, concat(u.first_name::text, ' ', u.last_name::text) AS creator_name , u.address as creator_address, u.email as creator_email from "${TABLE_NAME}" p LEFT JOIN "${TABLE_NAME_USER}" u ON u.id = p.created_by) tmp WHERE tmp.approved=TRUE AND tmp.finalized=FALSE AND tmp.locked=FALSE AND tmp.start_time IS NULL`
      )
        .then(res => {
          const items = res.rows;

          jobLog('PROPOSALS FOUND:', items.length);

          items.forEach(proposal => {
            jobLog('starting with ', proposal.id);

            DB.update(TABLE_NAME, { locked: true }, proposal.id).then(__ => {
              jobLog('proposal locked in the db');

              web3.eth.getBlock('latest', (____err, block) => {
                if (____err) {
                  jobLog("Couldn't get the latest block");
                  jobLog(____err);
                }
                // EVM "now" + 1 minute
                const start_time = block.timestamp + 120;

                const end_time =
                  start_time +
                  parseInt(
                    proposal.funding_process_duration * 60 * 60 * 24,
                    10
                  );

                const wei = web3.toWei(
                  parseFloat(proposal.funds_required),
                  'ether'
                );
                const goal = new web3.BigNumber(wei);
                const rate = new web3.BigNumber(
                  parseFloat(proposal.rate).toString()
                );
                const cap = goal;

                const contract = Contract(RSTCrowdsale);
                contract.setProvider(provider);
                contract.defaults({
                  from: base_account,
                });

                deployToken(web3, provider, base_account, proposal)
                  .then(tokenInstance => {
                    const account = proposal.creator_address;

                    const dataContract = {};
                    if (process.env.CURRENT_NETWORK === 'development') {
                      dataContract.gas = 6000000;
                    }

                    jobLog('==== DEPLOYING CONTRACT WITH PARAMS: =====');
                    jobLog('start_time', start_time);
                    jobLog('end_time', end_time);
                    jobLog('rate', rate);
                    jobLog('account', account);
                    jobLog('cap', cap);
                    jobLog('tokenInstance.address', tokenInstance.address);
                    jobLog('goal', goal);
                    jobLog('dataContract', dataContract);

                    contract
                      .new(
                        start_time,
                        end_time,
                        rate,
                        account,
                        cap,
                        tokenInstance.address,
                        goal,
                        dataContract
                      )
                      .then(instance => {
                        jobLog('Contract deployed to ', instance.address);

                        // Make the crowdsale the owner of the contract
                        tokenInstance
                          .transferOwnership(instance.address)
                          .then(___ => {
                            jobLog('Crowdsale is now the owner of the token');
                            jobLog('Crowdsale deployment complete!');
                          })
                          .catch(e => {
                            jobLog('Cant transfer token ownership', e);
                          });

                        const proposalData = {
                          address: instance.address,
                          status: 'active',
                          locked: false,
                          start_time: parseInt(start_time, 10),
                          end_time: parseInt(end_time, 10),
                          token_address: tokenInstance.address,
                        };

                        DB.update(TABLE_NAME, proposalData, proposal.id)
                          .then(_res => {
                            jobLog('proposal deployed and updated in the db');

                            // Send an email to the proposal creator
                            // To let him/her know that we deployed the contract
                            let base_url = config.BASE_URL_DEV;
                            if (process.env.NODE_ENV !== 'development') {
                              base_url = config.BASE_URL_PROD;
                            }

                            const link = `${base_url}/proposal/${proposal.id}`;

                            const html_content = `
																						<p>Dear ${proposal.creator_name},</p>

																						<p>
																							Congratulations! Your proposal "${
                                                proposal.name
                                              }" has been approved by the IKU network and now you can start receiving funding!</br /></br />
																							<a href="${link}">${link}</a>
																						</p>
																						<p>
																							If you are not able to click on the link above, copy and paste it into your browser.
																						</p>
																						<p>
																							Best,<br />
																							The IKU Team
																						</p>		
																					`;

                            Sendgrid.sendEmail({
                              from: config.FROM_EMAIL,
                              to: proposal.creator_email,
                              subject: 'Proposal approved!',
                              html_content,
                            });
                          })
                          .catch(_____err => {
                            jobLog(
                              'Error updating proposal in DB after deployment',
                              _____err
                            );
                          });
                      });
                  })
                  .catch(e => {
                    jobLog('Error deploying crowdsale contract', e);

                    DB.update(
                      TABLE_NAME,
                      {
                        locked: false,
                      },
                      proposal.id
                    )
                      .then(___ => {
                        jobLog('proposal unlocked in db after failing');
                      })
                      .catch(_____err => {
                        jobLog(
                          'Error unlocking the proposal in DB after failing',
                          _____err
                        );
                      });

                    return false;
                  })
                  .catch(e => {
                    jobLog('Error deploying token', e);
                    return false;
                  });
              });
            });
          });
        })
        .catch(___err => {
          jobLog('Error while fetching proposals', ___err);
        });
    });
  },
};
