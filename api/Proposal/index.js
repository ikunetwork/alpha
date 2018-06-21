const config = require('../Config');
const DB = require('../Database');

const TABLE_NAME = 'proposal';
const TABLE_NAME_VOTES = 'proposal_vote';
const TABLE_NAME_USER = 'user';
const TABLE_NAME_COMMENTS = 'proposal_comment';
const Contract = require('truffle-contract');
const ResearchSpecificToken = require('../../build/contracts/ResearchSpecificToken.json');
const RSTCrowdsale = require('../../build/contracts/RSTCrowdsale.json');
const IPFS = require('ipfs-api');
const CryptoJS = require('crypto-js');
const Web3 = require('web3');

class Proposal {
  static normalize(obj) {
    // Fields that we don't want to expose through the API
    const private_fields = ['encryption_key', 'ipfs_hash'];
    const new_obj = { ...obj };
    private_fields.forEach(key => {
      delete new_obj[key];
    });

    return new_obj;
  }

  static get(req) {
    return new Promise((resolve, reject) => {
      if (req.query.id) {
        const { id } = req.query;
        const q = `SELECT * FROM (
                SELECT p.*, 
                concat(u.first_name::text, ' ', u.last_name::text) AS creator_name,
                u.address as creator_address, 
                u.email as creator_email 
                FROM "${TABLE_NAME}" p 
                LEFT JOIN "${TABLE_NAME_USER}" u 
                ON u.id = p.created_by) tmp 
                WHERE tmp.id = ${id}`;

        DB.query(q)
          .then(res => {
            const proposal = Proposal.normalize(res.rows[0]);
            if (req.query.web3) {
              const provider = config.getProvider();
              const crowdsale = Contract(RSTCrowdsale);
              crowdsale.setProvider(provider);
              crowdsale.at(proposal.address).then(contractInstance => {
                contractInstance.weiRaised().then(wei => {
                  const web3 = new Web3(provider);
                  proposal.amount_raised = web3.fromWei(wei, 'ether');
                  resolve(proposal);
                });
              });
            } else {
              resolve(proposal);
            }
          })
          .catch(e => {
            reject({ message: e.message });
          });
      } else {
        DB.query(`SELECT * FROM "${TABLE_NAME}" ORDER BY id DESC`)
          .then(res => resolve(res.rows.map(i => Proposal.normalize(i))))
          .catch(e => {
            reject({ message: e.message });
          });
      }
    });
  }

  static post(req) {
    return new Promise((resolve, reject) => {
      const data = req.body;

      if (data.attachments.length) {
        data.attachments = JSON.stringify(data.attachments);
      } else {
        delete data.attachments;
      }

      data.created_by = req.user.id;

      if (!data.rare_disease) {
        delete data.rare_disease;
      }

      // Default values for RST

      data.rate = config.RST_DEFAULT_RATE.toString();
      data.cap = data.funds_required;
      data.decimals = config.RST_DEFAULT_DECIMALS;

      DB.insert(TABLE_NAME, data)
        .then(res => resolve(Proposal.normalize(res.rows[0])))
        .catch(e => {
          reject({ message: e.message });
        });
    });
  }

  static put(req) {
    return new Promise((resolve, reject) => {
      const data = req.body;
      const proposal_id = req.body.id;
      delete data.id;

      // Once the proposal has been approved
      // Only some of the fields are allowed to be updated

      DB.get('proposal', proposal_id).then(res => {
        const proposal = Proposal.normalize(res.rows[0]);
        let allowed = true;

        if (proposal.approved) {
          const restricted_fields = [
            'created_by',
            'name',
            'investigator_name',
            'investigator_location',
            'rare_disease',
            'thesis',
            'current_stage',
            'empirical_data',
            'anecdotal_data',
            'scientific_justification',
            'observations',
            'funds_required',
            'funding_process_duration',
            'socioeconomic_implication',
            'attachments',
            'roadmap',
            'image',
          ];
          // check that we're gonna update allowed fields
          for (let i = 0; i < Object.keys(data).length; i++) {
            const key = Object.keys(data)[i];
            if (restricted_fields.indexOf(key) !== -1) {
              reject({
                error: `The field ${key} can't be updated at this time`,
              });
              allowed = false;
              break;
            }
          }
        }

        if (allowed) {
          if (data.attachments.length) {
            data.attachments = JSON.stringify(data.attachments);
          } else {
            delete data.attachments;
          }
          if (!data.rare_disease) {
            delete data.rare_disease;
          }

          DB.update(TABLE_NAME, data, proposal_id)
            .then(r => resolve(Proposal.normalize(r.rows[0])))
            .catch(e => {
              reject({ message: e.message });
            });
        }
      });
    });
  }

  static getVoteCount(req) {
    const { id } = req.query;

    return new Promise((resolve, reject) => {
      DB.query(`SELECT * FROM "${TABLE_NAME_VOTES}" WHERE proposal_id = ${id}`)
        .then(res => {
          resolve({
            votes: res.rowCount,
          });
        })
        .catch(e => {
          reject({ message: e.message });
        });
    });
  }

  static vote(req) {
    const { id } = req.body;
    const { ip } = req;

    return new Promise((resolve, reject) => {
      DB.query(
        `SELECT * FROM "${TABLE_NAME_VOTES}" WHERE ip='${ip}' AND proposal_id = ${id}`
      )
        .then(res => {
          if (res.rows && res.rows.length) {
            resolve({ error: 'You already voted' });
          } else {
            const data = {
              proposal_id: id,
              ip,
            };

            DB.insert(TABLE_NAME_VOTES, data)
              .then(_ => {
                Proposal.checkActivationThreshold(req)
                  .then(response => {
                    resolve({
                      success: true,
                      activated: response.activated,
                    });
                  })
                  .catch(_e => {
                    reject(_e);
                  });
              })
              .catch(__e => {
                reject(__e);
              });
          }
        })
        .catch(e => {
          reject({ message: e.message });
        });
    });
  }

  static addComment(req) {
    const { proposal_id, parent_id, comment } = req.body;

    return new Promise((resolve, reject) => {
      DB.insert(TABLE_NAME_COMMENTS, {
        created_by: req.user.id,
        proposal_id,
        comment,
        parent_id,
      })
        .then(result => Proposal.getCommentsForProposal(proposal_id))
        .then(comments => {
          resolve(comments);
        })
        .catch(error => {
          console.log('Error creating comment: ', error);
          reject(error);
        });
    });
  }

  static getCommentsForProposal(proposal_id) {
    return new Promise((resolve, reject) => {
      DB.query(
        `SELECT * FROM (
          SELECT c.*,
          concat(u.first_name:: text, ' ', u.last_name:: text) AS user_name,
          u.address as user_address
          FROM "${TABLE_NAME_COMMENTS}" c
          LEFT JOIN "${TABLE_NAME_USER}" u
          ON u.id = c.created_by
        ) tmp WHERE tmp.proposal_id = ${proposal_id}
         ORDER BY tmp.parent_id ASC, tmp.created_at ASC`
      )
        .then(response => {
          const comments = [];
          // First

          function normalizeRow(row, rows) {
            const { id, created_at, comment, user_name, user_address } = row;
            const item = {
              id,
              created_at,
              comment,
              user: {
                name: user_name,
                address: user_address,
              },
              replies: [],
            };

            const replies = rows.filter(r => r.parent_id === id);
            if (replies.length > 0) {
              replies.forEach(reply => {
                item.replies.push(normalizeRow(reply, rows));
              });
            }
            return item;
          }

          response.rows
            .filter(_row => _row.parent_id === null)
            .forEach((row, i) => {
              comments.push(normalizeRow(row, response.rows));
            });

          resolve({ comments });
        })
        .catch(error => {
          console.log('Error getting comments: ', error);
          reject(error);
        });
    });
  }

  static getComments(req) {
    return Proposal.getCommentsForProposal(req.query.id);
  }

  static checkActivationThreshold(req) {
    const { id } = req.body;

    return new Promise((resolve, reject) => {
      DB.query(`SELECT * FROM "${TABLE_NAME_VOTES}" WHERE proposal_id = ${id}`)
        .then(res => {
          if (res.rowCount >= config.RST_ACTIVATION_THRESHOLD) {
            DB.update(TABLE_NAME, { approved: true }, id)
              .then(_ => {
                resolve({ activated: true });
              })
              .catch(e => {
                reject({ message: e.message });
              });
          } else {
            resolve({ activated: false });
          }
        })
        .catch(e => {
          reject({ message: e.message });
        });
    });
  }

  static accessToData(req) {
    return new Promise((resolve, reject) => {
      DB.query(`SELECT * FROM "${TABLE_NAME}" WHERE id='${req.query.id}'`)
        .then(res => {
          const record = res.rows[0];

          // Get the token address from db,
          const { token_address } = record;

          // Get token instance
          const provider = config.getProvider();
          // const web3 = new Web3(provider);
          const token = Contract(ResearchSpecificToken);
          token.setProvider(provider);

          token
            .at(token_address)
            .then(tokenInstance =>
              tokenInstance.balanceOf.call(req.user.address)
            )
            .then(result => {
              const balance = result
                .dividedBy(10 ** parseInt(record.decimals, 10))
                .toFormat(0);
              if (balance >= config.RST_ACCESS_DATA_THRESHOLD) {
                // Download file from ipfs
                const ipfs = IPFS(config.IPFS_HOST, config.IPFS_PORT, {
                  protocol: 'https',
                });

                ipfs.files.cat(record.ipfs_hash, (err, file) => {
                  if (err) {
                    console.log(
                      'IFPS :: error while reading file',
                      record.ipfs_hash,
                      err
                    );
                  }

                  const encrypted_file_content = file.toString('utf8');
                  const bytes = CryptoJS.AES.decrypt(
                    encrypted_file_content,
                    record.encryption_key
                  );
                  const plaintext = bytes.toString(CryptoJS.enc.Utf8);
                  resolve({ content: plaintext });
                });
              } else {
                reject({
                  message: 'not enough tokens to access data',
                });
              }
            });
        })
        .catch(e => {
          reject({ message: e.message });
        });
    });
  }

  static accessToLicense(req) {
    return new Promise((resolve, reject) => {
      DB.query(`SELECT * FROM "${TABLE_NAME}" WHERE id='${req.query.id}'`)
        .then(res => {
          const record = res.rows[0];
          // Get the token address from db,
          const { token_address } = record;

          // Get token instance
          const provider = config.getProvider();
          // const web3 = new Web3(provider);
          const token = Contract(ResearchSpecificToken);
          token.setProvider(provider);

          token
            .at(token_address)
            .then(tokenInstance =>
              tokenInstance.balanceOf.call(req.user.address)
            )
            .then(result => {
              const balance = result
                .dividedBy(10 ** parseInt(record.decimals, 10))
                .toFormat(0);
              if (balance >= config.RST_ACCESS_LICENSE_THRESHOLD) {
                // This is the license
                const content = `This is a license for the data that allows the owner of the ETHEREUM address: ${
                  req.user.address
                }, which is currently the owner of at least ${
                  config.RST_ACCESS_LICENSE_THRESHOLD
                } ${record.token_name} (${
                  record.token_symbol
                }) to utilize the data from this research`;

                resolve({ content });
              } else {
                reject({
                  message: 'not enough tokens to access the license',
                });
              }
            });
        })
        .catch(e => {
          reject({ message: e.message });
        });
    });
  }
}

module.exports = Proposal;
