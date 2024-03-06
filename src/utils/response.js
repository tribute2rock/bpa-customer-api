const { Status } = require("../constants/response");

/**
 * Prepares a json response according to the arguments provided.
 *
 * @param res
 * @param code
 * @param message
 * @param data
 */
const respond = (res, code, message, data) => {

  let response = {
    status: getStatusMessage(code),
  }

  if(message) {
    response.message = message;
  }

  if(data) {
    response.data = data;
  }

  res.status(code).json(response);
}

/**
 * Prepares status messages based on the http status code provided.
 * The status messages are strings defined in the constants/response.
 *
 * @param code
 * @returns {string}
 */
const getStatusMessage = (code) => {
  if (code >= 100 && code <= 199) {
    return Status.Information;
  } else if (code >= 200 && code <= 299) {
    return Status.Success;
  } else if (code >= 300 && code <= 399) {
    return Status.Redirect;
  } else if (code >= 400 && code <= 499) {
    return Status.Failed;
  } else {
    return Status.Unknown;
  }
}

module.exports = {
  respond
};
