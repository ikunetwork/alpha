const Sendgrid = require('../Sendgrid');
const EthUtil = require('ethereumjs-util');
const SigUtil = require('eth-sig-util');
const Config = require('../Config');
const DB = require('../Database');

const Jwt = require('jsonwebtoken');

const TABLE_NAME = 'user';

class User {
  static findById(id) {
    return new Promise((resolve, reject) => {
      DB.query(`SELECT * FROM "${TABLE_NAME}" WHERE id='${id}'`)
        .then(res => {
          resolve(res.rows[0]);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  static login(req) {
    return new Promise((resolve, reject) => {
      // First of all, check that the signature belongs
      // To that account
      const text =
        'By clicking on "Sign" you agree to the terms of iku.network';
      const msg = EthUtil.bufferToHex(Buffer.from(text, 'utf8'));
      const msgParams = { data: msg };
      msgParams.sig = req.body.sign;
      let recovered = null;
      try {
        recovered = SigUtil.recoverPersonalSignature(msgParams);
      } catch (err) {
        console.log(
          'USER :: Exception while recovering personal signature',
          err
        );
      }

      if (recovered && recovered === req.body.address) {
        DB.query(
          `SELECT * FROM "${TABLE_NAME}" WHERE address='${req.body.address}'`
        )
          .then(res =>
            resolve({
              id: res.rows[0].id,
              address: res.rows[0].address,
            })
          )
          .catch(e => {
            reject({
              message:
                'Invalid credentials. Please check that you are using the right account.',
            });
          });
      } else {
        reject({ error: 'invalid signed message' });
      }
    });
  }

  static signup(req) {
    return new Promise((resolve, reject) => {
      if (req.body.address && req.body.sign) {
        DB.query(
          `SELECT * FROM "${TABLE_NAME}" WHERE address='${req.body.address}'`
        )
          .then(res => {
            if (res.rows.rowCount > 0) {
              reject({
                error: 'You are already registered. Please login instead.',
              });
            } else {
              DB.insert(TABLE_NAME, {
                address: req.body.address,
                signature: req.body.sign,
              })
                .then(_res =>
                  resolve({
                    id: _res.rows[0].id,
                    address: _res.rows[0].address,
                  })
                )
                .catch(_e => {
                  reject(_e);
                });
            }
          })
          .catch(e => {
            console.log('USER :: Error during signup ', e);
            reject(e);
          });
      }
    });
  }

  static update(req) {
    return new Promise((resolve, reject) => {
      const data = req.body;
      const user_id = req.user.id;
      // Otherwise the email verification could get hacked
      if (data.verfied) {
        delete data.verfied;
      }
      delete data.id;

      DB.update(TABLE_NAME, data, user_id)
        .then(res => {
          resolve(res.rows[0]);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  static verifyEmail(req) {
    return new Promise((resolve, reject) => {
      const user_id = req.user.id;
      DB.update(TABLE_NAME, { verified: true }, user_id)
        .then(res => {
          resolve(res.rows[0]);
        })
        .catch(e => {
          reject(e);
        });
    });
  }

  static sendEmail(user) {
    const tokenData = {
      address: user.address,
      id: user.id,
    };
    let base_url = Config.BASE_URL_DEV;
    if (process.env.NODE_ENV !== 'development') {
      base_url = Config.BASE_URL_PROD;
    }

    const token = Jwt.sign(tokenData, process.env.JWT_SECRET);
    const link = `${base_url}/verify-email?token=${token}`;

    const html_content = `
			<p>Dear ${user.first_name},</p>

			<p>
				Thank you for registering on iku.network.</br />
				Please click on the link below to verify your email address:</br /></br />
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

    return Sendgrid.sendEmail({
      from: Config.FROM_EMAIL,
      to: user.email,
      subject: 'Verify your email',
      html_content,
    });
  }
}

module.exports = User;
