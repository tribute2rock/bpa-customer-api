const categoriesController = require('./categories');
const formsController = require('./forms');
const requestsController = require('./requests');
const authenticationController = require('./authentication');
const formBuilderController = require('./formbuilder');
const draftRequestController = require('./draftRequest');
const externalController = require('./external');
const workFlowLogController = require('./workFlowLogs');
const requestStoreController = require('./requeststore');
const branchController = require('./branches');
const channelManagerController = require('./channelManager');
const encryptionController = require('./encryption');
const customerController = require('./customerController');

module.exports = {
  categoriesController,
  formsController,
  requestsController,
  authenticationController,
  formBuilderController,
  draftRequestController,
  externalController,
  workFlowLogController,
  requestStoreController,
  branchController,
  channelManagerController,
  encryptionController,
  customerController
};
