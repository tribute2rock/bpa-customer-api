/**
 * All the models for the application are registered and exported from here.
 *
 */

const Sequelize = require('sequelize');
const connection = require('../config/database');

const Permission = require('./permission')(connection, Sequelize);
const OtpCode = require('./otp_code')(connection, Sequelize);
const Role = require('./role')(connection, Sequelize);
const RolePermission = require('./role_permission')(connection, Sequelize);
const Branch = require('./branch')(connection, Sequelize);
const Department = require('./department')(connection, Sequelize);
const Province = require('./province')(connection, Sequelize);
const User = require('./user')(connection, Sequelize);
const RoleUser = require('./role_user')(connection, Sequelize);
const Customer = require('./customer')(connection, Sequelize);
const Trigger = require('./trigger')(connection, Sequelize);
const Action = require('./action')(connection, Sequelize);
const Category = require('./category')(connection, Sequelize);
const Workflow = require('./workflow')(connection, Sequelize);
const WorkflowView = require('./workflow_view')(connection, Sequelize);
const WorkflowLevel = require('./workflow_level')(connection, Sequelize);
const WorkflowMaster = require('./workflow_master')(connection, Sequelize);
const WorkflowLog = require('./workflow_log')(connection, Sequelize);
const Status = require('./status')(connection, Sequelize);
const Form = require('./form')(connection, Sequelize);
const Request = require('./request')(connection, Sequelize);
const RequestValue = require('./request_value')(connection, Sequelize);
const DraftRequest = require('./draft_request')(connection, Sequelize);
const DraftRequestValue = require('./draft_request_value')(connection, Sequelize);
const WorkflowFiles = require('./workflow_files')(connection, Sequelize);
// const LC = require('./lc_backup')(connection, Sequelize);
const DynamicModel = require('./dynamicModel')(connection, Sequelize);
const ReferenceNumber = require('./reference_no')(connection, Sequelize);
const OtpEmailLogs = require('./otp_email_logs')(connection, Sequelize);

module.exports = {
  Branch,
  Province,
  Department,
  User,
  Action,
  Permission,
  Role,
  RolePermission,
  RoleUser,
  Workflow,
  WorkflowView,
  WorkflowLevel,
  WorkflowLog,
  WorkflowMaster,
  Trigger,
  Form,
  Customer,
  Category,
  Status,
  Request,
  RequestValue,
  DraftRequest,
  DraftRequestValue,
  WorkflowFiles,
  OtpCode,
  // LC,
  DynamicModel,
  ReferenceNumber,
  OtpEmailLogs,
};
