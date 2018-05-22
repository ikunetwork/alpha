const sdk = require('sendgrid');

const SengridHelper = sdk.mail;

class Sendgrid {
  static sendEmail(options) {
    return new Promise((resolve, reject) => {
      const mail = new SengridHelper.Mail(
        new SengridHelper.Email(options.from),
        options.subject,
        new SengridHelper.Email(options.to),
        new SengridHelper.Content('text/html', options.html_content)
      );

      const sg = sdk(process.env.SENDGRID_API_KEY);
      const request = sg.emptyRequest({
        method: 'POST',
        path: '/v3/mail/send',
        body: mail.toJSON(),
      });

      sg.API(request, (error, response) => {
        if (error) {
          reject(error);
        } else {
          resolve(response);
        }
      });
    });
  }
}

module.exports = Sendgrid;
