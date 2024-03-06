const Validator = require('validatorjs');
const ValidationError = require('../errors/validation');

const validator = (body, rules, messages) => {
  const validation = new Validator(body, rules, messages);
  if (validation.fails(undefined)) {
    throw new ValidationError(validation.errors);
  }
}

module.exports = validator;
