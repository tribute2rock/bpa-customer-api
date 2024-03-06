/**
 * Custom rule to check if account number is valid.
 *
 * @param value
 * @param helpers
 * @returns {*}
 */
const account_number = (value, helpers) => {
  if (value !== "1111111111") {
    return helpers.error("any.invalid");
  }
  return value;
};

/**
 * Custom rule to check if not null.
 *
 * @param value
 * @param helpers
 * @returns {number|*}
 */
const required = (value, helpers) => {
  if (!value) {
    return helpers.error("any.required");
  }
  if (typeof value === "number" && value === 0) {
    return helpers.error("any.required");
  }
  if (value === "") {
    return helpers.error("any.required");
  }
  return value;
};

/**
 * Custom rule to check mime type.
 *
 * @param value
 * @param helpers
 * @returns {*}
 */
const mimetype = (value, helpers) => {
  let constraint = value.constraint ? value.constraint.trim().split(",") : [];
  let fileMimeType;
  if (value.data) {
    fileMimeType = value.data.mimetype ? value.data.mimetype.trim() : "";
  }
  if (constraint.includes(fileMimeType)) {
    return value;
  }
  return helpers.message("The provided file type for " + (value.label ? value.label : "file field") + " is not supported");
};

/**
 * Custom rule to check max file size.
 *
 * @param value
 * @param helpers
 * @returns {*|{data}|{constraint}}
 */
const maxFileSize = (value, helpers) => {
  const maxSizeLimit = value.constraint ? Math.abs(Number(Number.parseFloat(value.constraint).toFixed(2))) : 0;
  const getSizeInKb = bytes => (bytes / Math.pow(1024, 1)).toFixed(2);
  if (maxSizeLimit && value.data && value.data.size) {
    if (getSizeInKb(value.data.size) < maxSizeLimit) {
      return value;
    }
  }
  return helpers.message("The file should not be greater than " + (maxSizeLimit ? maxSizeLimit : "unknown limit.") + " KB");
};


/**
 * Custom rule to check mime type.
 *
 * @param value
 * @param helpers
 * @returns {*}
 */
const inDropdownApi = (value, helpers) => {
  const XMLHttpRequest = require("xmlhttprequest").XMLHttpRequest;
  const r = new XMLHttpRequest();
  r.open("GET", value.constraint, false);  // `false` makes the request synchronous
  r.send(null);

  if (r.status === 200) {
    const options = JSON.parse(r.responseText);
    const match = options.find(x => x.value === value.data.trim(''));
    if (match) {
      return value;
    }
  }
  return helpers.message(`The selected ${value.label ? value.label : "field value"} is not available.`);
};

module.exports = {
  account_number,
  required,
  mimetype,
  maxFileSize,
  inDropdownApi
};
