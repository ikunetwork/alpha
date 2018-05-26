const DB = require('../Database');

const TABLE_NAME = 'research_target';
const TABLE_NAME_VOTES = 'research_target_vote';
const request = require('request');
const config = require('../Config');

class ResearchTarget {
  static get(req) {
    return new Promise((resolve, reject) => {
      if (req.query.id) {
        DB.query(`SELECT * FROM "${TABLE_NAME}" WHERE id='${req.query.id}'`)
          .then(res => resolve(res.rows[0]))
          .catch(e => {
            reject(e);
          });
      } else {
        DB.query(`SELECT * FROM "${TABLE_NAME}" ORDER BY id DESC`)
          .then(res => resolve(res.rows))
          .catch(e => {
            reject(e);
          });
      }
    });
  }

  static post(req) {
    const data = req.body;
    return new Promise((resolve, reject) =>
      request.post(
        config.GOOGLE_CAPTCHA_VERIFY_URL,
        {
          form: {
            secret: process.env.GOOGLE_CAPTCHA_SECRET,
            response: req.body.captcha_token,
            ip: req.ip,
          },
        },
        (error, response, body) => {
          const json = JSON.parse(body);

          if (json.success) {
            // Captcha valid, let's store the RT

            delete data.captcha_token;

            DB.insert(TABLE_NAME, data)
              .then(res => resolve(res.rows[0]))
              .catch(e => reject(e));
          } else {
            reject(body);
          }
        }
      )
    );
  }

  static put(req) {
    const data = req.body;
    return new Promise((resolve, reject) =>
      request.post(
        config.GOOGLE_CAPTCHA_VERIFY_URL,
        {
          form: {
            secret: process.env.GOOGLE_CAPTCHA_SECRET,
            response: req.body.captcha_token,
            ip: req.ip,
          },
        },
        (error, response, body) => {
          const json = JSON.parse(body);

          if (json.success) {
            // Captcha valid, let's update the RT
            const rt_id = req.body.id;
            delete data.id;
            delete data.captcha_token;

            DB.update(TABLE_NAME, data, rt_id)
              .then(res => resolve(res.rows[0]))
              .catch(e => {
                reject(e);
              });
          } else {
            reject(body);
          }
        }
      )
    );
  }

  static getVoteCount(req) {
    const { id } = req.query;

    return new Promise((resolve, reject) => {
      DB.query(
        `SELECT * FROM "${TABLE_NAME_VOTES}" WHERE research_target_id = ${id}`
      )
        .then(res => {
          resolve({
            votes: res.rowCount,
          });
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  static vote(req) {
    const { id } = req.body;
    const { ip } = req;

    return new Promise((resolve, reject) => {
      DB.query(
        `SELECT * FROM "${TABLE_NAME_VOTES}" WHERE ip='${ip}' 
        AND research_target_id = ${id}`
      )
        .then(res => {
          if (res.rows && res.rows.length) {
            reject({ error: 'You already voted' });
          } else {
            const data = {
              research_target_id: req.body.id,
              ip,
            };

            DB.insert(TABLE_NAME_VOTES, data)
              .then(_res => {
                ResearchTarget.getVoteCount({
                  query: { id: req.body.id },
                }).then(__res => {
                  resolve(__res);
                });
              })
              .catch(_e => {
                reject(_e);
              });
          }
        })
        .catch(e => {
          reject(e);
        });
    });
  }
}

module.exports = ResearchTarget;
