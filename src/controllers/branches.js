const { Branch } = require('../models');
const { HTTP, Status } = require('../constants/response');

const all = async (req, res) => {
  try {
    Branch.findAll({ where: { isDeleted: false } }).then((branch) => {
      // res.json(branch);
      res.status(HTTP.StatusOk).json({
        status: Status.Success,
        message: 'Successfully fetch all branches.',
        data: branch,
      });
    });
  } catch (e) {
    res.status(HTTP.StatusInternalServerError).json({
      status: Status.Failed,
      message: 'Failed to fetch branches.',
      data: null,
    });
  }
};

module.exports = {
  all,
};
