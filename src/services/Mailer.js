const sg = require('@sendgrid/mail');
const config = require('../configs/config');

class MailerService {
  constructor() {
    sg.setApiKey(config.SENDGRID_KEY);
  }

  send(data = {}) {
    return new Promise(async (resolve, reject) => {
      return sg.send(data, (err, result) => {
        if (err) {
          return reject(err);
        }

        return resolve(result);
      });
    })
  }
}

module.exports = new MailerService();
