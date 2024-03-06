const router = require('express').Router();
const multer = require('../config/multer');
const middlewares = require('../config/middlewares');
var Recaptcha = require('express-recaptcha').RecaptchaV3;
var recaptcha = new Recaptcha('6LfeWBgfAAAAAKsJvs1w9Gu2q4FDnvvsBAL9DbhD', '6LfeWBgfAAAAAKgF1_1eIqY-SpDQAMi157I9gmQF', {
  callback: 'cb',
});

const {
  categoriesController,
  formsController,
  requestsController,
  draftRequestController,
  authenticationController,
  formBuilderController,
  externalController,
  workFlowLogController,
  channelManagerController,
  branchController,
  encryptionController,
  customerController,
} = require('../controllers');
const { customers, fees, chargeProfile, branchList, productType, customerDetail } = require('../mocks');
const { authenticationValidation } = require('../validations');

const chargeURL = process.env.CHARGE_PROFILE;
const branchURL = process.env.BRANCH_LIST;
const productURL = process.env.PRODUCT_TYPE_LIST;
const customerURL = process.env.CUSTOMER_DETAIL;

/**
 * Routes for authentication.
 */
// router.get('/dynamicController', DynamicController.createDynamicController);

/**
 * Routes for Captche.
 */
router.get('/captcha', recaptcha.middleware.render, function (req, res) {
  // console.log(res.recaptcha)
  res.json({ captcha: res.recaptcha });
});
/**
 * Routes for authentication.
 */
router.post('/initiate-login', authenticationValidation.initiateLogin, authenticationController.initiateLogin);
router.post('/reset-password', authenticationValidation.userRegister, authenticationController.resetPassword);
router.post('/cooperate-login', authenticationController.corporateLogin);
router.post('/send-otp', authenticationController.generateLoginOTP);
router.post('/login', authenticationValidation.login, authenticationController.login);
router.post('/refresh', authenticationValidation.refresh, authenticationController.refresh);

/**
 * Routes for categories.
 */
router.get('/categories', categoriesController.getAllCategories);
router.get('/categories/:id/', categoriesController.getSubCategories);
/** This route will return only the available categories */
router.get('/categoryForms', categoriesController.categoryForms);

/**
 * Routes for forms.
 */
// router.get('/form/', middlewares.externalAuth, formsController.getForms);
router.get('/form/', formsController.getForms);
router.get('/general-form/:id', formsController.getGeneralFormById);
router.get('/form/:id/', middlewares.authorize, formsController.getFormsById);
router.get('/forms/:catid/', formsController.getFormsByCatId);
router.get('/forms/:categoryId/search', formsController.searchField);

/**
 * Routes for requests.
 */
router.post('/requests', middlewares.authorize, multer, requestsController.store);
router.get('/requests', middlewares.authorize, requestsController.all);
router.put('/request/:id', [middlewares.authorize, multer], requestsController.editRequest);
router.get('/request/:id', middlewares.authorize, requestsController.getSingleRequestById);
router.get('/req', middlewares.authorize, requestsController.getRequestById);
router.get('/requests/:id', middlewares.authorize, requestsController.getRequestByAuthIdAndKey);
router.get('/requests/:id/category', middlewares.authorize, requestsController.getCategoryByRequestId);
router.post('/generalCategoryRequest', multer, requestsController.storeGeneralCategoryRequest);
// router.get('/requestcount', middlewares.authorize, requestsController.countRequest);
// router.get('/requestfile/:id', requestsController.getFileofRequest);
/**
 * Routes for workFlowLogs.
 */
router.post('/workflowlogs', multer, middlewares.authorize, workFlowLogController.store);
/**
 * Routes for draft requests.
 */
router.post('/draft-request', multer, middlewares.authorize, draftRequestController.store);
router.get('/draft-request', middlewares.authorize, draftRequestController.allDrafts);
router.get('/draft-requestId', middlewares.authorize, draftRequestController.getDraftById);
router.get('/draft-request/:id', middlewares.authorize, draftRequestController.getDraftByAuthIdAndKey);
router.put('/draft-request/:id', middlewares.authorize, draftRequestController.editDraft);
router.delete('/draft-request/:id', middlewares.authorize, draftRequestController.deleteDraft);

// Route for checking if account Number, Email and Mobile Number
router.get('/isValid', customerController.checkValidity);
/**
 * Getting internal branches from database
 */
router.get('/dbBranches', branchController.all);

/**
 * Routes for form builder.
 */
router.get('/auto-populate', middlewares.authorize, formBuilderController.autoPopulate);
router.post('/validate', formBuilderController.validate);
router.post('/attachment', multer, formBuilderController.fileUpload);
router.get('/customerDetailPop', middlewares.authorize, formBuilderController.customerDetail);

// router.get('/external/branches', externalController.branches);
router.get('/external/merchants', externalController.merchants);
router.get('/external/card-brands', externalController.cardBrands);
router.get('/external/fees', externalController.fees);
router.get('/external/payment-options', externalController.paymentOptions);
router.get('/external/card-types', externalController.cardTypes);
router.get('/external/ub-request-type', externalController.ubRequestTypes); // Block/Unblock request types.
router.get('/external/transaction-modes', externalController.transactionModes);

// view customre file
router.get('/customer-uploads/:id/:type/:filename', requestsController.viewCustomerFile);
router.get('/download-request/:requestId/:templateId', requestsController.generateRequestDocument);
router.get('/preview-request/:requestId/:templateId', requestsController.generateRequestDocumentPreview);

// to retrieve print template details on request
router.get('/request/:id/getPrintTemplate', requestsController.getPrintRequest);

// to retrieve print template details on request
router.get('/decrypt', encryptionController.Decrypt);

//Global Mock Routes
router.route(`${branchURL}`).post((req, res) => {
  return res.json(branchList);
});

router.route(`${chargeURL}`).post((req, res) => {
  return res.json(chargeProfile);
});

router.route(`${productURL}`).post((req, res) => {
  return res.json(productType);
});

router.route(`${customerURL}`).post((req, res) => {
  return res.json(customerDetail);
});

router.get('/external/branches', externalController.branchList);
router.get('/external/charge-profile', externalController.chargeList);
router.get('/external/product-type', externalController.productList);
router.get('/customer_card_details', externalController.customerDetail);

/**
 * Route for Channel Manager
 */
router.get('/channel-manager/auth-token', channelManagerController.authToken);
router.get('/channel-manager/branches-lists', channelManagerController.branches);
router.post('/channel-manager/toccms', multer, middlewares.authorize, channelManagerController.postToCCMS);
// router.get('/channel-manager/statusccms', middlewares.authorize, channelManagerController.statusFromCCMS);
router.get('/channel-manager/countccms', middlewares.authorize, channelManagerController.statusCountFromCCMS);

/**
 * Route for Global customer route
 */
router.route('/global/CustomerDetails').get((req, res) => {
  const user = customers.find(
    (customer) => customer.ACCOUNT_NUMBER == req.query.acctNo && customer.MOBILE_NUMBER == req.query.mobileNo
  );
  if (user) {
    res.status(200).json([user]);
  } else {
    res.status(402).json({ Message: 'Invalid login credentials' });
  }
});

/**
 * Route for Sunrise SMS
 */
router.route('/global/SendSMS').post((req, res) => {
  res.status(200).send('OK');
});

/**
 * Route for global fee
 */
router.route('/global/validate').get((req, res, next) => {
  const formFee = fees.find((fee) => fee.profile_id == req.query.profileId && fee.type == req.query.feeType);
  if (formFee) {
    res.status(200).json(formFee);
    // res.status(200).json([formFee]);
  } else {
    res.status(402).json({ Message: 'Cannot find selected form fee' });
  }
});

/**
 * Route for branches mock.
 */
router.route('/mock-branches').get((req, res, next) => {
  res.status(200).json([
    {
      value: '069',
      text: 'Biratnagar',
    },
    {
      value: '070',
      text: 'Hetauda',
    },
    {
      value: '071',
      text: 'Kathmandu',
    },
    {
      value: '072',
      text: 'Pokhara',
    },
    {
      value: '073',
      text: 'Nepalgunj',
    },
    {
      text: '074',
      value: 'Surkhet',
    },
  ]);
});

/**
 * Route for merchants mock.
 */
router.route('/mock-merchants').get((req, res, next) => {
  res.status(200).json([
    {
      id: 10,
      mid: 100010,
      merchant_name: 'TATHAASTU MOBILE PVT LTD',
    },
    {
      id: 11,
      mid: 100011,
      merchant_name: 'AROGIN HEALTH CARE & RESEARCH',
    },
  ]);
});
module.exports = router;