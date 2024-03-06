const Joi = require("joi");
const customRules = require("./customRules");
const formBuilderUtils = require('../../utils/formBuilder');


/**
 * Runs a validation rule and returns an error message if any.
 *
 * @param rule
 * @param data
 * @returns {*|null}
 */
const validate = (rule, data) => {
  const key = data[0];
  const r = resolveRule(rule);
  const schema = Joi.object({
    [key]: r
  })


  let toValidate;
  if(r.hasOwnProperty('isCustom') && r.isCustom === true && rule.hasOwnProperty('constraint')) {
    toValidate = {
      data: data[1],
      constraint : rule.constraint,
      label: data[0],
    }
  } else {
    toValidate = data[1];
  }

  const {error} = schema.validate({
    [key]: toValidate
  });
  return error ? getErrorMessage(error, rule, key) : null;
}

/**
 * Resolve a rule based on the string passed.
 *
 * @param rule
 * @returns {Joi.NumberSchema|Joi.StringSchema|Joi.Schema}
 */
const resolveRule = (rule) => {
  let r;
  switch (rule.rule) {
    case 'required':
      r = Joi.custom(customRules.required, "Custom required rule to handle both string and number.");
      r.isCustom = true;
      break;
    case 'email':
      r = Joi.string().email();
      break;
    case 'account_number':
      r = Joi.custom(customRules.account_number, "Account number validation.");
      r.isCustom = true;
      break;
    case 'min':
      r = Joi.number().min(Number(rule.constraint));
      break;
    case 'max':
      r = Joi.number().max(Number(rule.constraint));
      break;
    case 'in':
      r = Joi.string().valid(...rule.constraint.split(','));
      break;
    case 'mime type':
      r = Joi.custom(customRules.mimetype, "Custom mime type rule to check if the file is of required type.");
      r.isCustom = true;
      break;
    case 'max file size':
      r = Joi.custom(customRules.maxFileSize, "Custom file size rule to check if the file is less than provided size");
      r.isCustom = true;
      break;
    case 'in options api':
      r = Joi.custom(customRules.inDropdownApi, "Custom rule to check if the value is available in drop down api.")
      r.isCustom = true;
      break;
    default:
      throw new Error('No rule found.');
  }
  return r;
}

/**
 * Formats an error message.
 *
 * @param error
 * @param rule
 * @param key
 * @returns {string}
 */
const getErrorMessage = (error, rule, key) => {
  let msg = error.message.replace(/"/g, '');
  msg = msg.charAt(0).toUpperCase() + msg.slice(1) + ".";
  return msg;
}

/**
 * Prepares data for validation using the request body.
 *
 * @returns {Promise<{}>}
 * @param req
 */
const prepareToValidate = async (req) => {
  const requestBody = req.body;
  const requestValues = JSON.parse(requestBody.requestValues);
  const validationObject = {};
  const validationRules = await formBuilderUtils.getValidationRules(requestBody.formId);
  const labels = await formBuilderUtils.getLabels(requestBody.formId);
  requestValues.map(item => {
    const key = labels.hasOwnProperty(item.name) ? labels[item.name] : item.name;
    validationObject[key] = {
      value: item.value,
      rules: validationRules.hasOwnProperty(item.name) ? validationRules[item.name] : null,
    }
    if (item.name.includes("fileupload")) {
      validationObject[key]['isFile'] = true;
      const file = req.files.find(x => x.fieldname === item.name);
      validationObject[key]["file"] = file ? file : null;
    }
  })
  return validationObject;
}

/**
 * Executes a validation on the provided data.
 *
 * @returns {{}}
 * @param req
 */
const Validate = async (req) => {
  const validationObject = await prepareToValidate(req);
  const errorMessages = {};
  for (const property in validationObject) {
    if (validationObject.hasOwnProperty(property)) {
      validationObject[property].rules.map((rule) => {
        if(rule.rule !== "0") {
          let error;
          if(validationObject[property].hasOwnProperty('isFile') && validationObject[property].isFile === true) {
            error = validate(rule, [property, validationObject[property].file]);
          }else {
            error = validate(rule, [property, validationObject[property].value]);
          }
          if (error && !errorMessages.hasOwnProperty(property)) {
            errorMessages[property] = error;
          }
        }
      });
    }
  }
  return errorMessages;
}

module.exports = Validate
