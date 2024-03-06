const HTTP = {
  StatusOk: 200,
  StatusCreated: 201,
  StatusUnauthorized: 401,
  StatusForbidden: 403,
  StatusNotFound: 404,
  StatusPreconditionFailed: 412,
  StatusUnprocessableEntity: 422,
  StatusInternalServerError: 500,
};

const Status = {
  Success: "Success",
  Failed: "Failed",
  Information: "Information",
  Redirect: "Redirect",
  Unknown: "Unknown",
};

module.exports = {
  HTTP,
  Status,
};
