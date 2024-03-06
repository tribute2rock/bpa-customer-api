const argon2 = require('argon2');

module.exports.hashPassword = (password) => {
  return argon2.hash(password, { type: argon2.argon2id });
};

module.exports.comparePassword = (hash, password) => {
  return argon2.verify(hash, password);
};
