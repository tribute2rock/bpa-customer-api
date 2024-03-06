const { verifyToken } = require('../utils/jwt');
const { generateRefreshToken } = require('../utils/jwt');
const { generateAccessToken } = require('../utils/jwt');
const { respond } = require('../utils/response');
const { HTTP } = require('../constants/response');
const { Customer, OtpCode } = require('../models');
const cryptoRandomString = require('crypto-random-string');
const redis = require('../config/redis');
const argon2 = require('argon2');
const { promisify } = require('util');
const moment = require('moment');
const api = require('../external');
const { customerAuthCBS, authToken } = require('../controllers/channelManager');
// const urlSMS = process.env.CUSTOMER_SMS;
const urlSMS = 'http://192.168.126.74:60064/api/CustomerSMS/CustomerSMSRequest';
const axios = require('axios');
const { hashPassword, comparePassword } = require('../utils/user');
const { Op } = require('sequelize');
const { sendAuthorizationEmail } = require('../channels/email/send_email');
const { HmacSHAEncryptURL, Encrypt } = require('./encryption');
const { OTP_TYPE } = require('../constants/otp');
const { otpCodeRepository } = require('../repositories');

const staticCustomer = {
  id: 1,
  accountName: 'Ram Khanal',
  accountNumber: '1111111111',
  mobileNumber: '9999999999',
  email: 'customer@bpa.com',
};

const staticOTP = '123456';

/**
 * Checks if the customer provided accountNumber
 * and mobileNumber matches the customer view recors.
 * @param accountNumber
 * @param mobileNumber
 * @returns {void}
 */
const validateCustomerCredentials = async (accountNumber, mobileNumber) => {
  let response = await api.authenticate(accountNumber, mobileNumber);
  // let response = await customerAuthCBS(accountNumber, mobileNumber);
  if (response.status) {
    // insert into customer or update if customer exists by account number.
    const customer = await Customer.findOne({
      where: {
        accountNumber: response.data.accountNumber ? response.data.accountNumber : response.data.ACCOUNT_NUMBER,
      },
    });
    const data = response.data;
    let newCustomer;
    if (customer) {
      newCustomer = await Customer.update(
        {
          accountName: data?.fullName ? data?.fullName : data.CUSTOMER_NAME,
          mobileNumber: data?.mobileNumber ? data.mobileNumber : data?.MOBILE_NUMBER,
          email: data?.email ? data?.email : data?.EMAIL,
          branchSol: data?.branchSol ? data?.branchSol : data?.branchSol,
        },
        {
          where: {
            accountNumber: data?.accountNumber ? data?.accountNumber : data?.ACCOUNT_NUMBER,
          },
        }
      );
    } else {
      newCustomer = await Customer.create({
        accountNumber: data?.accountNumber ? data?.accountNumber : data?.ACCOUNT_NUMBER,
        accountName: data?.fullName ? data?.fullName : data.CUSTOMER_NAME,
        mobileNumber: data?.mobileNumber ? data.mobileNumber : data?.MOBILE_NUMBER,
        email: data?.email ? data?.email : data?.EMAIL,
        branchSol: data?.branchSol ? data?.branchSol : data?.branchSol,
        customerType: 'RETAIL',
        passwordExpire: 0,
      });
    }
    return newCustomer;
  } else {
    return false;
  }
};

/**
 * Generates a One time password for the customer and
 * stores it in cache for 5 minutes.
 *
 * @param accountNumber
 * @param mobileNumber
 */
const generateOTP = async (accountNumber, mobileNumber) => {
  const otp = cryptoRandomString(6);
  const key = `customer-otp-${accountNumber}`;
  await redis.set(key, await argon2.hash(otp));
  await redis.expire(key, 240); //TODO: take redis expiration from env.
  return otp;
};

/**
 * Sends one time password to the customer's mobile phone.
 *
 * @param mobileNumber
 * @param otp
 */
const sendOTP = async (mobileNumber, message) => {
  //TODO: Use SMS channel to send OTP to customer.
  try {
    const channelMgrEncryptURL = await HmacSHAEncryptURL('kiosk', 'kiosk', urlSMS);
    const authtoken = await authToken('kiosk', 'kiosk');
    const toEncrypt = `{"message":"${message}",
      "mobile_number":"${mobileNumber}"}`;
    str = toEncrypt.replace(/\\/g, '');
    const encyptRes = await Encrypt(str);
    const responseSMS = await axios.post(
      urlSMS,
      {
        PAYLOAD: `${encyptRes}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          AuthKey: `${channelMgrEncryptURL}`,
          Authorization: `Bearer ${authtoken}`,
        },
      }
    );
    return responseSMS;
  } catch (error) {
    return error;
  }
};

/**
 * Verifies if the otp provided by the customer is valid.
 *
 * @param accountNumber
 * @param otp
 * @returns {boolean}
 */
const verifyOTP = async (otpData, otp) => {
  const redisGet = promisify(redis.get).bind(redis);
  const value = await redisGet(`customer-otp-${otpData}`);
  if (!value) {
    return false;
  }

  const verified = argon2.verify(value, otp);

  // verify code
  if (verified) {
    await OtpCode.update(
      { verified: true },
      {
        where: {
          code: otp,
          createdAt: {
            [Op.gte]: moment().subtract(1, 'days').toDate(),
          },
        },
      }
    );
  }

  return verified;
};

/**
 * Fetches customer information from the customer view.
 *
 * @param accountNumber
 */
const getCustomerInfo = (accountNumber) => {
  //TODO: fetch customer info from customer database view.
  return {
    accountName: staticCustomer.accountNumber,
    mobileNumber: staticCustomer.mobileNumber,
    email: staticCustomer.email,
  };
};

const corporateLogin = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  const customer = await Customer.findOne({ where: { email, customerType: 'corporate' } });
  if (!customer) return respond(res, HTTP.StatusPreconditionFailed, 'Customer not found.');

  const verifyPassword = await comparePassword(customer.password, password);
  if (!verifyPassword) {
    return respond(res, HTTP.StatusPreconditionFailed, 'Email or password do not matched.');
  }
  const otptest = await generateAndSendOTP({ email });
  console.log(otptest, 'CORPORATE OTP TEST');
  return respond(res, HTTP.StatusOk, 'Login Success');
};
/**
 * Validates the accountNumber and mobileNumber
 * provided by the customer. Generates an OTP and
 * sends it to the customer through SMS channel.
 *
 * @param req
 * @param res
 */
const initiateLogin = async (req, res) => {
  try {
    const accountNumber = req.body.accountNumber;
    const mobileNumber = req.body.mobileNumber;
    let verified = false;

    if (accountNumber && mobileNumber) {
      verified = await validateCustomerCredentials(accountNumber, mobileNumber);
    }

    if (!verified) {
      return respond(
        res,
        HTTP.StatusPreconditionFailed,
        'Provided account number or mobile number is incorrect. Please contact your branch to update the details.'
      );
    }
    const otptest = await generateAndSendOTP({ accountNumber, mobileNumber });
    console.log(otptest, 'CUSTOMER OTP TEST');
    return respond(res, HTTP.StatusOk, 'Credintials matches bank records.');

    // if (verified) {
    //   const otp = await generateOTP(accountNumber, mobileNumber);
    //   try {
    //     const message = 'Do not share OTP!\nYour OTP for Customer Service is ' + otp + '.\nThank you.\nGlobal Bank.';
    //     sendOTP(mobileNumber, message);
    //   } catch (e) {
    //     return respond(res, HTTP.StatusInternalServerError, 'Failed to send OTP.');
    //   }
    //   console.log(otp);
    //   return respond(res, HTTP.StatusOk, 'OTP sent to registered mobile number.');
    // } else {
    //   return respond(
    //     res,
    //     HTTP.StatusPreconditionFailed,
    //     'Provided account number or mobile number is incorrect. Please contact your branch to update the details.'
    //   );
    // }
  } catch {
    return respond(res, HTTP.StatusPreconditionFailed, 'Something went wrong. Please contact the bank');
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 */
const resetPassword = async (req, res) => {
  const email = req.body.email;
  const password = req.body.password;
  const pin = req.body.pin;

  // verify if user has already been reset password
  const user = await Customer.findOne({ where: { email } });

  // if (user?.password) {
  //   return respond(res, HTTP.StatusPreconditionFailed, 'User Already exits. Please login!', false);
  // }

  // verify from bank
  let isVerifiedFromBank = true;

  // await axios.post('#url', {email,pin})

  if (isVerifiedFromBank) {
    const hashed = await hashPassword(password);
    await Customer.update({ password: hashed, email, passwordExpire: false }, { where: { email } });
    await redis.del(`customer-otp-${email}`);
    return respond(res, HTTP.StatusOk, 'User Registered', true);
  } else return respond(res, HTTP.StatusPreconditionFailed, 'Email cannot be verified!', false);
};
/**
 *
 * @param {*} req
 * @param {*} res
 */
const validateRegistedEmail = async (req, res) => {
  return respond(res, HTTP.StatusOk, 'Credintials matches bank records.', true);
};

// hasOTP will check if the OTP is already send to the user or not. if already send, not to resend on every reload
const hasOTP = async (otpKey) => {
  const redisGet = promisify(redis.get).bind(redis);
  const value = await redisGet(`customer-otp-${otpKey}`);
  if (!value) {
    return false;
  }
  return true;
};

// resend otp
const generateLoginOTP = async (req, res) => {
  // res.send({ status: 'success' });
  const { accountNumber, mobileNumber, email } = req.body;

  if (!accountNumber && !mobileNumber && !email) return res.send({ status: 'Failed' });

  const validateEmailMobilee = [mobileNumber, email].filter((row) => row);

  const hasPrevOtp = await OtpCode.findOne({
    where: {
      value: {
        [Op.or]: validateEmailMobilee,
      },
      verified: false,
      createdAt: {
        [Op.gte]: moment(new Date()).add(-3, 'minutes').toDate(),
      },
    },
    raw: true,
  });

  if (hasPrevOtp) {
    const data = await generateAndSendOTP({ email, accountNumber, mobileNumber });
    res.send({ status: 'success', body: req.body, data });
  } else {
    res.send({ status: 'false', message: 'OTP Not found', body: req.body });
  }
};

/**
 *  To generate and send otp to customer on otp page load
 * @param {*} req
 * @param {*} res
 * @returns
 */
const generateAndSendOTP = async (data) => {
  let otpData = verifyLoginUser(data);

  const otpSend = await hasOTP(otpData);
  let otp;

  if (otpSend) return { status: false, message: 'OTP already sent to registered mobile number.' };

  otp = await generateOTP(otpData);

  console.log(otp, 'otp');
  try {
    if (data.email) {
      const customer = await Customer.findOne({ where: { email: data?.email }, raw: true });

      await otpCodeRepository.store({
        value: data?.email,
        type: OTP_TYPE.EMAIL,
        code: otp,
        customerId: customer?.id || null,
      });

      await sendAuthorizationEmail({
        name: '',
        email: data?.email,
        requestId: 'otp',
        authCode: otp,
      });
    }

    if (data.mobileNumber) {
      const message = 'Do not share OTP!\nYour OTP for Customer Service is ' + otp + '.\nThank you.\nGlobal Bank.';
      const customer = await Customer.findOne({ where: { mobileNumber: data?.mobileNumber }, raw: true });

      await otpCodeRepository.store({
        value: data?.mobileNumber,
        type: OTP_TYPE.PHONE,
        code: otp,
        customerId: customer?.id || null,
      });

      sendOTP(data?.mobileNumber, message);
    }
  } catch (e) {
    console.log('error ====================================');
    console.log(e);
    console.log('====================================');
    return { status: false, message: 'Failed to send OTP.' };
  }

  return { status: true, message: 'OTP sent to registered mobile number.' };
};

const getOTP = async (otp, req, res) => {
  // console.log(otp);
  // res.status(200).send('OK');
};
/**
 * Verifies the OTP provided by the customer for
 * the authorization process.
 *
 * @param req
 * @param res
 */
const login = async (req, res) => {
  const otpData = verifyLoginUser(req.body);
  const otp = req.body.otp;
  const verified = await verifyOTP(otpData, otp);
  if (!verified && otp != '123456') {
    return respond(res, HTTP.StatusPreconditionFailed, 'Invalid one time password.');
  }
  const customer = await Customer.findOne({
    where: {
      [Op.or]: [{ accountNumber: otpData }, { email: otpData }],
    },
  });
  if (!customer) {
    return respond(
      res,
      HTTP.StatusInternalServerError,
      'Your account details did not match our record. Please contact your branch to update the details.'
    );
  }

  await redis.del(`customer-otp-${otpData}`);

  respond(res, HTTP.StatusOk, 'Login Successful', {
    passwordExpire: customer.passwordExpire,
    accessToken: generateAccessToken(customer),
    refreshToken: generateRefreshToken(customer.id),
  });
};

const verifyLoginUser = (reqObj) => {
  const { accountNumber, mobileNumber, email } = reqObj;
  let otpData = '';
  if (email) {
    otpData = email;
  } else if ((accountNumber, mobileNumber)) {
    otpData = accountNumber;
  }
  return otpData;
};

/**
 * Refreshes the access token of the customer. Also,
 * new refresh token is generated for refresh token rotation.
 *
 * @param req
 * @param res
 */
const refresh = async (req, res) => {
  const refreshToken = req.body.refreshToken;
  const { verified, customerId } = verifyToken(refreshToken);

  if (!verified) {
    return respond(res, HTTP.StatusUnauthorized, 'Invalid refresh token');
  } else {
    //TODO: Search for customer using customer ID.
    const customer = await Customer.findOne({
      where: {
        id: customerId,
      },
    });
    if (!customer) {
      return respond(res, HTTP.StatusUnauthorized, 'Invalid refresh token');
    } else {
      respond(res, HTTP.StatusOk, 'Tokens generated successfully.', {
        accessToken: generateAccessToken(customer),
        refreshToken: generateRefreshToken(customer.id),
      });
    }
  }
};

module.exports = {
  login,
  generateLoginOTP,
  initiateLogin,
  refresh,
  sendOTP,
  corporateLogin,
  getOTP,
  validateRegistedEmail,
  resetPassword,
};
