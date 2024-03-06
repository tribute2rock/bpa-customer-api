const { sendAuthCodeEmail } = require('../channels/email/send_email');
const { AuthorizationTokenNotFoundError } = require('../errors/authorization');

/**
 * Extracts the access token from the authorization header
 * of a request. Throws an AuthorizationTokenNotFoundError
 * if no access token was found in the request.
 *
 *
 * @param req
 */
const extractAuthorizationToken = (req) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (token == null) {
    throw new AuthorizationTokenNotFoundError();
  } else {
    return token;
  }
};

/**
 * generate  digit alphanumeric code ad returns it.
 * @returns {Promise<string>}
 */
const generateAuthCode = async () =>
  Math.random()
    .toString(36)
    .replace(/[^a-z0-9]+/g, '')
    .substr(0, 6);

const sendNewRequestEmail = async (request, randomNumber) => {
  const emailData = {
    name: 'Dummy User',
    email: 'someuser@test.com.np',
    requestId: request.id,
    authCode: randomNumber,
  };
  await sendAuthCodeEmail(emailData);
};

module.exports = {
  extractAuthorizationToken,
  generateAuthCode,
  sendNewRequestEmail,
};
