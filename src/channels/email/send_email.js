const {
  userAuthorizationEmailTemplate,
  authCodeEmailTemplate,
  customerRegisterRequestTemplate,
} = require('./email_templates');
const { sendMessage } = require('./email');

module.exports.sendAuthorizationEmail = async (body) => {
  sendMessage(userAuthorizationEmailTemplate(body));
};

module.exports.sendAuthCodeEmail = async (body) => {
  sendMessage(authCodeEmailTemplate(body));
};

// Email after customer submit registration form
module.exports.sendRegistrationEmail = async (body) => {
  sendMessage(customerRegisterRequestTemplate(body));
};
