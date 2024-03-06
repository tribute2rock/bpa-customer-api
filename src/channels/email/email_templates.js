const fs = require('fs');
const { resolve } = require('path');

module.exports.userAuthorizationEmailTemplate = (data) => {
  const html =
    `<p>Dear ${data.name},</p>` +
    `<br/>` +
    `<p>We received a request to verify client through your email Address.` +
    `</br>` +
    `Your authorization code is:  </p>` +
    `<strong> ${data.authCode} </strong>` +
    `<br/>` +
    `If you did not request this code, please ignore this email.` +
    `<br/>` +
    `<strong>Please do not forward or give this code to anyone.</strong>` +
    `<br/>` +
    `Sincerely Yours,` +
    `<br/>` +
    `Global Bank .` +
    `</p>`;

  return {
    to: data.email,
    subject: 'Global Bank - BPA Authorization Code ',
    text: '',
    html: html,
  };
};

module.exports.authCodeEmailTemplate = (data) => {
  const html =
    `<p>Dear ${data.name},</p>` +
    `<br/>` +
    `<p>Greeting from Global IME Bank!</p>` +
    `</br>` +
    `<p>Your request has been successfully submitted to bank.</p>` +
    `<strong>Request Key: ${data.requestId} </strong>` +
    `<br/>` +
    `Sincerely Yours,` +
    `<br/>` +
    `Global Bank .` +
    `</p>`;

  return {
    to: data.email,
    subject: 'Global Bank - BPA Authorization Code ',
    text: '',
    html: html,
  };
};

const template = () => {
  return fs.readFileSync(resolve(__dirname, './template.html')).toString();
};

module.exports.customerRegisterRequestTemplate = (data) => {
  const html =
    `<p>Dear ${data.name},</p>` +
    `<br/>` +
    `<p>Greetings from Global IME Bank!</p>` +
    `<p>Your Online LC/BG Login credential request is successfully submitted to the bank. </p>` +
    `<strong>Request Key: ${data.requestKey}</strong>` +
    `<p>We shall notify you shortly after your request is processed, Please stay with us.</p>` +
    `<br/>` +
    `Thanking for choosing Global IME Bank Ltd.` +
    `<br/>` +
    `Best Regards,` +
    `<br/>` +
    `Trade Operation Team` +
    `</p>`;

  return {
    to: data.email,
    subject: 'Global IME Bank - BPM Login Credentials Request',
    text: '',
    html: html,
  };
};