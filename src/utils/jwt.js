const jwt = require('jsonwebtoken');
const { JWT } = require('../config');

/**
 * Generates an access token with the user data payload
 * as passed in the argument.
 *
 * @param user
 * @returns {*}
 */
const generateAccessToken = (user) => {
  return jwt.sign(user.toJSON(), JWT.SECRET, {
    expiresIn: JWT.ACCESS_TOKEN_EXPIRY,
  });
};

/**
 * Generates a refresh token for a user.
 *
 * @param id
 * @returns {*}
 */
const generateRefreshToken = (id) => {
  return jwt.sign({ user: id }, JWT.SECRET, {
    expiresIn: JWT.REFRESH_TOKEN_EXPIRY,
  });
};

/**
 * Verifies if a jwt token is valid.
 *
 * @param token
 */
const verifyToken = (token) => {
  try {
    const user = jwt.verify(token, JWT.SECRET);
    return {
      verified: true,
      user,
    };
  } catch (e) {
    return {
      verified: false,
      user: null,
    };
  }
};

/**
 * Checks if a token is valid.
 *
 * @param token
 * @returns {{data: (*), status: boolean}}
 */
const isValidToken = (token) => {
  try {
    const data = jwt.verify(token, JWT.SECRET);
    return {
      status: true,
      data,
    };
  } catch (e) {
    return {
      status: false,
      data: null,
    };
  }
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyToken,
  isValidToken,
};
