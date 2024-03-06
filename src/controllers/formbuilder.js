const { respond } = require('../utils/response');
const { customerDetailCRN } = require('./channelManager');
/**
 * Send auto populate data.
 * @param req
 * @param res
 */
const autoPopulate = async (req, res) => {
  const field = req.query.field ? req.query.field : 'account_number';
  let data;
  switch (field) {
    case 'accountNumber':
      data = req.user.accountNumber;
      break;
    case 'mobileNumber':
      data = req.user.mobileNumber;
      break;
    case 'accountName':
      data = req.user.accountName;
      break;
    default:
      respond(res, 412, 'Validation failed', {
        errors: {
          field: ['The provided field is invalid.'],
        },
      });
  }
  respond(res, 200, null, data);
};

const customerDetail = async (req, res) => {
  let data = req.user.accountNumber;
  const customer = await customerDetailCRN(data);
  res.json(customer);
};

/**
 * Validates a specific field.
 *
 * @param req
 * @param res
 */
const validate = async (req, res) => {
  // if (!(req.body.value.length > 10)) {
  //   respond(res, 412, "Validation failed", {
  //     errors: [
  //       "The value is incorrect."
  //     ]
  //   })
  // } else {
  //   respond(res, 200, null, null)
  // }
  respond(res, 200, null, null);
};

/**
 * Handles customer file upload.
 *
 * @param req
 * @param res
 * @returns {Promise<void>}
 */
const fileUpload = async (req, res) => {
  const file = req.file;
  if (!file) {
    return respond(res, 412, 'Failed to upload file.');
  }
  return respond(res, 200, 'File uploaded successfully', file);
};

module.exports = {
  autoPopulate,
  validate,
  fileUpload,
  customerDetail,
};
