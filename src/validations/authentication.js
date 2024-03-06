const validator = require('../config/validator');

/**
 * Validates the login request.
 *
 * @param req
 * @param res
 * @param next
 */
const login = async (req, res, next) => {
  // TODO: add more validation.
  validator(req.body, {
    accountNumber: 'required_without:email',
    email: 'required_without:accountNumber',
    otp: 'required',
  });
  next();
};

/**
 * Validates the authorization request.
 *
 * @param req
 * @param res
 * @param next
 */
const initiateLogin = async (req, res, next) => {
  // TODO: add validation rules.
  validator(req.body, {
    accountNumber: 'required|regex:/^[0-9]*$/',
    // accountNumber: 'required|min:14|max:14|regex:/^[0-9]*$/',
    mobileNumber: 'required|min:10|max:10',
  });
  next();
};

const userRegister = async (req, res, next) => {
  // TODO: add validation rules.
  validator(req.body, {
    email: 'required|email',
    password: ['required', 'min:8', 'regex:/[@!#^&*.,/$-/:-?{-~!"^_`[]/'],
    confirmPassword: 'required',
  });
  next();
};

/**
 * Validates the authorization request.
 *
 * @param req
 * @param res
 * @param next
 */
const refresh = async (req, res, next) => {
  // TODO: add validation rules.
  validator(req.body, {
    refreshToken: 'required',
  });
  next();
};

module.exports = {
  login,
  initiateLogin,
  userRegister,
  refresh,
};
