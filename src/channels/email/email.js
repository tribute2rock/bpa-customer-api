const { logger } = require('../../config/logger');
const nodemailer = require('nodemailer');
const { EMAIL } = require('../../config');
const { createRegistraionMailLogs } = require('./email_registration');

const transporter = nodemailer.createTransport({
  host: EMAIL.HOST,
  port: EMAIL.PORT,
  auth:{
    user: EMAIL.USERNAME,
    pass: EMAIL.PASSWORD
  },
  secure: false,
  debug: true,
});

module.exports.sendMessage = async (email) => {
  return transporter
    .sendMail({
      from: 'globalonline_noreply@gibl.com.np',
      ...email,
    })
    .then((info) => {
      createRegistraionMailLogs(email, info);
      if (info.rejected.length) {
        console.log(info.rejected, '----mail rejected');
      }
      console.log(info, '----mail send')
      return info;
    })
    .catch((err) => {
      createRegistraionMailLogs(email, err);
      // logger.error(err);
      console.log(err, '-----mail error');
    });
};
