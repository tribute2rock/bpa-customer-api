// const { UserNotAuthenticated } = require('../errors/authorization');
const { extractAuthorizationToken } = require('../utils/request');
const { respond } = require('../utils/response');
const { HTTP } = require('../constants/response');
const { verifyToken } = require('../utils/jwt');
const BasicAuthUser = process.env.AUTH_USER_EXTERNAL;
const BasicAuthPass = process.env.AUTH_PASS_EXTERNAL;
/**
 * Checks if the user is authorized or not based on the
 * access token passed in the authorization header.
 *
 * @param req
 * @param res
 * @param next
 */
const authorize = async (req, res, next) => {
  const token = extractAuthorizationToken(req);
  const { verified, user } = verifyToken(token);
  if (verified) {
    req.user = user;
    next();
  } else {
    // throw new UserNotAuthenticated();
    return respond(res, HTTP.StatusUnauthorized, 'User Not Authenticated.');
  }
};

const externalAuth = async (req, res, next) => {
  if (!req.headers.authorization) {
    return respond(res, HTTP.StatusUnauthorized, 'User Not Authenticated.');
  }

  const base64Credentials = req.headers.authorization.split(' ')[1];
  const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
  const [username, password] = credentials.split(':');

  if (username !== BasicAuthUser || password !== BasicAuthPass) {
    return respond(res, HTTP.StatusUnauthorized, 'User Not Authenticated.');
  }
  next();
};

module.exports = {
  authorize,
  externalAuth,
};
