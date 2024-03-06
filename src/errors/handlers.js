const { respond } = require('../utils/response');
const { HTTP } = require('../constants/response');

/**
 * Handles the error when ValidationError is captured.
 *
 * @param err
 * @param res
 */
function ValidationErrorHandler(err, res) {
  let errMessage;
  const { message, data } = err;

  if (process.env.NODE_ENV == 'development') errMessage = err.message;
  else errMessage = err.name;

  respond(res, HTTP.StatusPreconditionFailed, errMessage, data);
}

/**
 * Handles the error when no token was found in the authorization header.
 *
 * @param err
 * @param res
 */
function AuthorizationTokenNotFoundErrorHandler(err, res) {
  return respond(res, HTTP.StatusUnauthorized, 'Unauthorized Action.');
}

const ErrorHandler = (err, req, res, next) => {
  console.log('==============================');
  console.log(err);
  console.log('==============================');
  const { name } = err;
  switch (name) {
    case 'Validation Error':
      ValidationErrorHandler(err, res);
      return;
    case 'Authorization Token Not Found':
      AuthorizationTokenNotFoundErrorHandler(err, res);
      return;
    default:
      respond(res, HTTP.StatusInternalServerError, 'Internal Server Error.');
  }
};

module.exports = ErrorHandler;
