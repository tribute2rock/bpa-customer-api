const axios = require('axios');
const { HTTP, Status } = require('../constants/response');
const user = require('../models/user');
const redis = require('../config/redis');
const cryptoRandomString = require('crypto-random-string');
const ChannelManagerUrl = process.env.CHANNEL_MANAGER_URL;
const { promisify } = require('util');
const branchesUrl = process.env.BRANCH_URL;
const { status: RequestStatus, actions } = require('../constants/request');
const { Encrypt, HmacSHAEncryptURL, HmacSHAEncryptURLNew } = require('../controllers/encryption');

const requestCallCM = async (url, body, cm) => {
  const encyptRes = await Encrypt(body);
  let channelMgrEncryptURL = await HmacSHAEncryptURL('kiosk', 'kiosk', url);
  let authtoken = await authToken('kiosk', 'kiosk');
  if (cm == 'new') {
    channelMgrEncryptURL = await HmacSHAEncryptURLNew('bpm', 'bpm', url);
    authtoken = await authTokenNewCM('bpm', 'bpm');
  }
  try {
    const response = await axios.post(
      url,
      {
        PAYLOAD: `${encyptRes}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          AuthKey: `${channelMgrEncryptURL}`,
          Authorization: `Bearer ${authtoken}`,
        },
      }
    );
    return response;
  } catch (error) {
    console.log('ERROR ON Request Call ChannelManager ----- ', error?.response?.status);
    return false;
  }
};

const authToken = async (usrname, pwd, req) => {
  const channelMgrEncryptURL = await HmacSHAEncryptURL(usrname, pwd, process.env.CHANNEL_MANAGER_URL);
  const string = `${JSON.stringify({ Username: usrname, Password: pwd })}`;
  const encyptRes = await Encrypt(string);
  try {
    const response = await axios.post(
      'http://192.168.126.74:60064/api/JwtToken/GetToken',
      {
        PAYLOAD: `${encyptRes}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          AuthKey: `${channelMgrEncryptURL}`,
        },
      }
    );
    let token = `${response.data}`;
    return token;
  } catch (e) {
    console.log(e);
  }
};

//Generate Auth Token for New Channel manager
const authTokenNewCM = async (uname, pwd) => {
  const url = 'http://192.168.126.74:60067/api/JWTToken/GetToken';
  const channelMgrEncryptURL = await HmacSHAEncryptURLNew(uname, pwd, url);
  const randomText = cryptoRandomString(8);
  const toEncrypt = `{"data":{"Username":"${uname}","Password":"${pwd}"}, "requestType":1,"transactionId":"${randomText}"}`;
  const encyptRes = await Encrypt(toEncrypt);
  try {
    const response = await axios.post(
      url,
      {
        PAYLOAD: `${encyptRes}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          AuthKey: `${channelMgrEncryptURL}`,
        },
      }
    );
    let token = `${response.data}`;
    return token;
  } catch (e) {
    console.log('Auth token Error New Channel manager ---- ', e?.response?.status);
  }
};

const redisToken = async (accNo) => {
  const redisGet = promisify(redis.get).bind(redis);
  let value = await redisGet(`CuInfo${accNo}`);

  if (!value) {
    return false;
  } else {
    return value;
  }
};

const customerAuthCBS = async (accountNumber, mobileNumber) => {
  const CbsUrl = `http://192.168.126.74:60064/api/CustomerInquiry/CustomerInquiryRequest`;
  let payload = `{"opracc":"${accountNumber}"}`;
  payload = payload.replace(/\\/g, '');

  let result = await requestCallCM(CbsUrl, payload);
  if (!result) {
    return false;
  }
  const finalRes = result.data.data;
  const parseResponse = JSON.parse(finalRes);

  if (parseResponse.status == 'failed') {
    return {
      status: false,
      error: 'Invalid Account Number',
    };
  }

  if (parseResponse) {
    const obj = {
      accountNumber: parseResponse.data.accountNo ? parseResponse.data.accountNo : null,
      fullName: parseResponse.data.fullName ? parseResponse.data.fullName : null,
      firstName: parseResponse.data.firstName ? parseResponse.data.firstName : null,
      middleName: parseResponse.data.middleName ? parseResponse.data.middleName : null,
      lastName: parseResponse.data.lastName ? parseResponse.data.lastName : null,
      gender: parseResponse.data.gender ? parseResponse.data.gender : null,
      salutation: parseResponse.data.salutation ? parseResponse.data.salutation : null,
      city: parseResponse.data.city ? parseResponse.data.city : null,
      country: parseResponse.data.country ? parseResponse.data.country : null,
      countryCode: parseResponse.data.countryCode ? parseResponse.data.countryCode : null,
      dob: parseResponse.data.dob ? parseResponse.data.dob : null,
      mobileNumber: parseResponse.data.mobileNo ? parseResponse.data.mobileNo : null,
      email: parseResponse.data.email ? parseResponse.data.email : null,
      address: parseResponse.data.address ? parseResponse.data.address : null,
      citizenshipNo: parseResponse.data.citizenshipNo ? parseResponse.data.citizenshipNo : null,
      chargeProfile: parseResponse.data.chargeProfile ? parseResponse.data.chargeProfile : null,
      branchSol: parseResponse.data.primarySolId ? parseResponse.data.primarySolId : null,
      productType: 'R2',
    };

    const response = await verifyMobileBanking(obj, mobileNumber);
    return response;
  }
};

// Fetch Customer Detail after KYC,  Verification
const customerDetailCRN = async (accountNumber) => {
  const CustInquiry = `http://192.168.126.74:60067/api/CustomerInquiryCrn/CustomerInquiryRequest`;
  const randomId = cryptoRandomString(8);
  let payload = `{"data": {
    "opracc":"${accountNumber}"
    },
    "requestType": 1,
    "transactionId": "${randomId}"
  }`;
  payload = payload.replace(/\\/g, '');
  let result = await requestCallCM(CustInquiry, payload, 'new');

  if (!result) {
    return { status: false, err };
  }
  const finalRes = result.data.data;
  const parseResponse = finalRes;

  if (parseResponse) {
    const obj = {
      accountNumber: parseResponse.data.accountNo ? parseResponse.data.accountNo : null,
      fullName: parseResponse.data.fullName ? parseResponse.data.fullName : null,
      firstName: parseResponse.data.firstName ? parseResponse.data.firstName : null,
      middleName: parseResponse.data.middleName ? parseResponse.data.middleName : null,
      lastName: parseResponse.data.lastName ? parseResponse.data.lastName : null,
      dob: parseResponse.data.dob ? parseResponse.data.dob : null,
      mobileNumber: parseResponse.data.mobileNo ? parseResponse.data.mobileNo : null,
      email: parseResponse.data.email ? parseResponse.data.email : null,
      citizenshipNo: parseResponse.data.citizenshipNo ? parseResponse.data.citizenshipNo : null,
      fatherName: parseResponse.data.FatherName ? parseResponse.data.FatherName : null,
      motherName: parseResponse.data.MotherName ? parseResponse.data.MotherName : null,
      branchSol: parseResponse.data.primarySolId ? parseResponse.data.primarySolId : null,
    };
    return obj;
  }
};

/**
 * Check customer account status (FREEZE_STATUS, SCHM_TYPE, BALANCE)
 * @param {*} accountNumber
 * @returns
 */
const customerAccountStatus = async (accountNumber) => {
  const customerStatus = `http://192.168.126.74:60067/api/CustomerStatus/CustomerStatusRequest`;
  const randomId = cryptoRandomString(8);
  let payload = `{"data": {
    "ACCT_NO":"${accountNumber}"
    },
    "requestType": 1,
    "transactionId": "${randomId}"
  }`;
  payload = payload.replace(/\\/g, '');
  let result = await requestCallCM(customerStatus, payload, 'new');

  if (!result) {
    return { status: false, err: 'Error on Customer Account Status' };
  }
  const finalRes = result.data.data?.CustStatus[0];
  const custStatus = finalRes;
  if (custStatus) {
    if (custStatus.ACCT_STATUS == 'DATA NOT FOUND') {
      return { status: false, message: 'Account data not found', data: custStatus };
    }
    if (custStatus.ACCT_STATUS != 'Account is Active') {
      return { status: false, message: 'Account status is inactive', data: custStatus };
    }
    if (custStatus.FREEZE_STATUS != 'Not Freeze') {
      return { status: false, message: 'Account status is freeze', data: custStatus };
    }
    if (custStatus.KYC_STATUS != 'COMPLETE') {
      return { status: false, message: 'KYC is not verified', data: custStatus };
    }
    return { status: true, message: 'Account status is active', data: custStatus };
  }
  return { status: false, message: 'Error on customer account status' };
};

const verifyMobileBanking = async (user, mobileNumber) => {
  const account = user.accountNumber;
  const mobile = mobileNumber;
  const name = user.fullName;

  const MbUrl = `http://192.168.126.74:60067/api/CustomerMobileBankingValidation/MobileBankingValidationRequest`;
  const randomText = cryptoRandomString(8);
  let payload = `{"data":{"RequestId":"${randomText}","AccountNumber":"${account}","AccountName":"${name}","MobileNumber":"${mobile}"}, "requestType":1,"transactionId":"${randomText}"}`;
  payload = payload.replace(/\\/g, '');
  let result = await requestCallCM(MbUrl, payload, 'new');

  if (!result) {
    console.log('Mobile banking validation failed');
    return {
      status: false,
    };
  }
  if (result?.data?.data.BKSNameMatch == 100 && result?.data?.data.BKSMobileMatch == 100) {
    const customerInfo = JSON.stringify(user);
    if (!user.mobileNumber) {
      user.mobileNumber = mobile;
    }
    if (!user.email) {
      user.email = 'test@email.com';
    }
    const key = `CuInfo${account}`;
    await redis.set(key, customerInfo);
    return {
      status: true,
      data: user,
    };
  } else {
    console.log('Mobile banking validation failed');
    return {
      status: false,
    };
  }
};

const branches = async (req, res) => {
  let payload = {};
  let result = await requestCallCM(branchesUrl, payload);

  if (!result) {
    return res.send([]);
  }

  const branchJson = result.data.data;
  const obje = JSON.parse(branchJson);
  const items = [];
  for (let i = 0; i < obje?.length; i++) {
    const item = {
      text: obje[i].DESC,
      value: obje[i].CODE,
    };
    items.push(item);
  }
  return res.send(items);
};

const postToCCMS = async (req, res) => {
  let finalData;
  let cm = 'old';
  const ccmsUrl = req.body.ccmsUrl;
  const acNo = req.user.accountNumber;
  const customerinfo = await redisToken(acNo);
  const customerRequestToCcms = JSON.parse(customerinfo);
  const formValue = JSON.parse(req.body.requestValues);
  console.log(formValue, "FORM VALUE", req.body.ccmsUrl)
  const newArray = formValue.map((item, index) => {
    return { [`${item.name}`]: item.value };
  });
  let reqValues = newArray.reduce((r, c) => Object.assign(r, c), {});
  console.log(formValue, "REQUEST VALUE", req.body.ccmsUrl)
  const chargeProfile = parseInt(customerRequestToCcms.chargeProfile);
  const pinopt = reqValues.pinOption;
  //If current customer account in doesnot match the form account number return

  let accountStatus = false;
  let validDetail = true;
  let validMessage = 'Cannot make new request on following form.';
  if (customerinfo && reqValues) {
    const transactionId = cryptoRandomString(8);
    switch (ccmsUrl) {
      case 'http://192.168.126.74:60064/api/NewDebitCardRequest/DebitCardRequest':
        console.log('I own a New Debit card');
        obj = {
          accountNumber: customerRequestToCcms.accountNumber || '',
          firstName: customerRequestToCcms.firstName || '',
          city: customerRequestToCcms.city || '',
          lastName: customerRequestToCcms.lastName || '',
          middleName: customerRequestToCcms.middleName || '',
          mobileNumber: customerRequestToCcms.countryCode + customerRequestToCcms.mobileNumber || '',
          gender: customerRequestToCcms.gender || '',
          salutation: customerRequestToCcms.salutation || '',
          country: customerRequestToCcms.country || '',
          dob: customerRequestToCcms.dob || '',
          email: customerRequestToCcms.email || '',
          address: customerRequestToCcms.city || '',
          citizenshipNo: customerRequestToCcms.citizenshipNo || '',
          chargeProfile: chargeProfile || '',
          productType: customerRequestToCcms.productType || '',
          collectFromBranch: reqValues.collectFromBranch || '',
          cardType: reqValues.cardType || '',
          pinOption: pinopt[0] || '',
          phoneNo: customerRequestToCcms.mobileNumber || '',
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60064/api/DebitCardRepin/DebitCardRepinRequest':
        console.log('I own a Repin Entry');
        obj = {
          identifier: customerRequestToCcms.accountNumber || '',
          collectFromBranch: reqValues.collectFromBranch || '',
          pinOptions: pinopt[0] || '',
          mobileNo: customerRequestToCcms.countryCode + customerRequestToCcms.mobileNumber || '',
          chargeProfile: chargeProfile || '',
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60064/api/DebitCardReplace/DebitCardReplaceRequest':
        console.log('I own a Debit Card Re-issue');
        obj = {
          identifier: customerRequestToCcms.accountNumber || '',
          mobileNo: customerRequestToCcms?.countryCode + customerRequestToCcms?.mobileNumber || '',
          collectFromBranch: reqValues.collectFromBranch || '',
          cardType: reqValues.cardType || '',
          pinOptions: pinopt[0] || '',
          replaceRemarks: reqValues.replaceRemarks || '',
          chargeProfile: chargeProfile || '',
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60064/api/DebitCardBlock/DebitCardBlockRequest':
        console.log('I own a Block Debit Card');
        obj = {
          identifier: customerRequestToCcms.accountNumber || '',
          blockType: reqValues.blockType || '',
          blockReason: reqValues.blockReason || '',
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60064/api/DebitCardUnblock/DebitCardUnblockRequest':
        console.log('I own a Unblock Debit Card');
        obj = {
          identifier: customerRequestToCcms.accountNumber || '',
          unblockReason: reqValues.unblockReason || '',
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60067/api/MobileTransactionProfileChange/Change':
        cm = 'new';
        console.log(reqValues.accountNumber)
        accountStatus = await customerAccountStatus(reqValues.accountNumber);
        obj = {
          data: {
            varStrAccNo: reqValues.accountNumber || '',
            varStrAccName: reqValues.accountName || '',
            varStrDOB: reqValues.dob || '',
            varStrBranch: reqValues.branch_name || '',
            varStrBranchSOL: reqValues.selectBranch || '',
            varStrEmail: reqValues.email || '',
            varStrMobNo: reqValues.mobileNumber || '',
            varStrChooseProfile: reqValues.chooseProfile || '',
            varStrIdentificationType: reqValues.identification_type || '',
            varStrCtzNo: reqValues.citizenshipNumber || '',
            varStrPassportNo: reqValues.passportNumber || '',
            varTxtChangeReason: reqValues.reason || '',
            varStrCtzOrPassportURL: req.files[1].filename || '',
            varStrSignatureURL: req.files[0].filename || '',
            varStatus: 'Initiate',
            varStrSource: 'externalBPM',
            varStrMakerID: 'bmp_dummy1',
          },
          requestType: 1,
          transactionId: transactionId,
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60067/api/BlockCustomer/BlockCustomerRequestt':
        cm = 'new';
        accountStatus = await customerAccountStatus(reqValues.accountNumber);
        obj = {
          data: {
            mobileNumber: reqValues?.mobileNumber || '',
            accountNumber: reqValues?.accountNumber || '',
            remarks: reqValues?.reason || '',
            organizationCode: 'GBIME',
          },
          requestType: 1,
          transactionId: transactionId,
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60067/api/MobileUnblock/Unblock':
        cm = 'new';
        accountStatus = await customerAccountStatus(reqValues.accountNumber);
        obj = {
          data: {
            varStrAccNo: reqValues?.accountNumber || '',
            varStrAccName: reqValues?.accountName || '',
            varStrDOB: reqValues?.dob || '',
            varStrBranch: reqValues?.branch_name || '',
            varStrBranchSOL: reqValues?.selectBranch || '',
            varStrEmail: reqValues?.email || '',
            varStrMobNo: reqValues?.mobileNumber || '',
            varStrIdentificationType: reqValues?.identification_type || '',
            varStrCtzNo: reqValues?.citizenshipNumber || '',
            varStrPassportNo: reqValues?.passportNumber || '',
            varTxtChangeReason: reqValues?.reason || '',
            varStrCtzOrPassportURL: req?.files[1].filename || '',
            varStrSignatureURL: req?.files[0].filename || '',
            varStatus: 'Initiate',
            varStrSource: 'externalBPM',
            varStrMakerID: 'bmp_dummy1',
          },
          requestType: 1,
          transactionId: transactionId,
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60067/api/SchemeTransfer/TransferRequest':
        cm = 'new';
        accountStatus = await customerAccountStatus(reqValues.account_number);
        obj = {
          data: {
            Account_x0020_Name: reqValues?.account_name,
            Old_x0020_Scheme: accountStatus.data?.SCHM_CODE,
            New_x0020_Scheme: reqValues?.new_scheme,
            Account_x0020_Number: reqValues?.account_number,
            Request_x0020_Type: 'External',
            External_x0020_Ref_x0020_No: 'Requestkey',
            External_x0020_Remarks: reqValues?.reason,
          },
          requestType: 1,
          transactionId: transactionId,
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60067/api/DormantActivation/ActivationRequest':
        cm = 'new';
        accountStatus = await customerAccountStatus(reqValues.account_number);
        obj = {
          data: {
            Account_x0020_Name: reqValues?.account_name,
            Account_x0020_Number: reqValues?.account_number,
            Reason_x0020_for_x0020_a_x002f_c: reqValues?.reason,
            External_x0020_Ref_x0020_No: 'Requestkey',
            Request_x0020_Type: 'External',
          },
          requestType: 1,
          transactionId: transactionId,
        };
        if (accountStatus.data?.ACCT_STATUS != 'Account is Active') {
          finalData = obj;
        } else {
          finalData = {};
          validDetail = false;
          validMessage = 'The following account is active.';
        }
        break;
      case 'http://192.168.126.74:60067/api/FixedDeposit/FixedDepositRequest':
        cm = 'new';
        accountStatus = await customerAccountStatus(reqValues.accountNumber);
        const detail = await customerDetailCRN(reqValues.accountNumber);
        const validFd = req.user.accountName == detail.fullName;
        if (!validFd) {
          finalData = {};
          validDetail = false;
          validMessage = 'Account Detail does not match.';
        }
        obj = {
          data: {
            AccountNumber: reqValues?.accountNumber,
            Currency: 'NPR',
            AmountInFig: reqValues?.fdAmount,
            AmountInWords: '',
            Tenure: reqValues?.fdTenure,
            ListID: '113',
            TenureYear: '',
            InterestPayment: 'Yearly',
            NomineeName: reqValues?.nomineeName || '',
            NomineeRelationship: reqValues?.nomineeRelationship || '',
            NomineeFathersName: reqValues?.nomineeFathersName || '',
            NomineeGrandFatherName: reqValues?.nomineeGrandFatherName || '',
            GaurdainNominee: reqValues?.gaurdainNominee || '',
            Gaurdianrelationship: reqValues?.gaurdianRelationship || '',
          },
          requestType: 1,
          transactionId: transactionId,
        };
        finalData = obj;
        break;
      case 'http://192.168.126.74:60067/api/MobileAccessProvision/Change':
        cm = 'new';
        accountStatus = await customerAccountStatus(reqValues.accountNumber);
        obj = {
          data: {
            varStrAccNo: reqValues.accountNumber || '',
            varStrAccName: reqValues.accountName || '',
            varStrDOB: reqValues.dob || '',
            varStrBranch: reqValues.branch_name || '',
            varStrBranchSOL: reqValues.selectBranch || '',
            varStrEmail: reqValues.email || '',
            varStrMobNo: reqValues.mobileNumber || '',
            varStrChooseProfile: reqValues.chooseProfile || '',
            varStrIdentificationType: reqValues.identification_type || '',
            varStrCtzNo: reqValues.citizenshipNumber || '',
            varStrPassportNo: reqValues.passportNumber || '',
            varTxtChangeReason: reqValues.reason || '',
            varStrCtzOrPassportURL: req.files[1].filename || '',
            varStrSignatureURL: req.files[0].filename || '',
            varStatus: 'Initiate',
            varStrSource: 'externalBPM',
            varStrMakerID: 'bmp_dummy1',
          },
          requestType: 1,
          transactionId: transactionId,
        };
        finalData = obj;
        break;
      default:
        validDetail = false;
        console.log("I don't own a any Reqest");
        break;
    }
  }

  if (!validDetail) {
    return res.json({
      status: Status.Failed,
      message: validMessage || 'Cannot make new request on following form.',
      data: '',
    });
  }
  if (accountStatus && !accountStatus.status) {
    return res.json({
      status: Status.Failed,
      message: accountStatus.message,
      data: '',
    });
  }
  var body = JSON.stringify(finalData);
  str = body.replace(/\\/g, '');

  const response = await requestCallCM(ccmsUrl, body, cm);
  if (!response) {
    return res.json({
      status: Status.Failed,
      message: 'Failed to submit request.',
    });
  }
  let resdata;
  resdata = response?.data?.data;
  if (cm == 'new') {
    resdata = response?.data;
    if (resdata.status == 'sucess' || resdata.msg == 'success') {
      return res.json({
        status: Status.Success,
        message: resdata?.message || 'Form submitted successfully',
        data: resdata?.data,
      });
    }

    return res.json({
      status: Status.Failed,
      message: resdata?.message || 'Form submission failed',
    });
  }
  // console.log(response.data, '---- Response from Post to CCMS');
  const resposeData = JSON.parse(resdata);
  if (resposeData.code == 0) {
    res.json({
      status: Status.Success,
      message: resposeData.message,
      data: resposeData.data,
    });
  } else if (resposeData.code == -1) {
    res.json({
      status: Status.Failed,
      message: resposeData.message,
      data: resposeData.data,
    });
  } else {
    return {
      status: true,
      data: resposeData,
    };
  }
};

const checkValidDetail = (accNumber, detail) => {
  if (accNumber) return false;
};

//OLD Mobile Banking Verification
// const verifyMobileBanking = async (user, mobileNumber) => {
//   const account = user.accountNumber;
//   const mobile = mobileNumber;
//   const name = user.fullName;

//   const MbUrl = `http://192.168.126.74:60064/api/CustomerMobileBankingValidation/MobileBankingValidationRequest`;
//   const channelMgrEncryptURL = await HmacSHAEncryptURL('kiosk', 'kiosk', MbUrl);
//   const randomText = cryptoRandomString(8);
//   const toEncrypt = `{"AccountNumber":"${account}", "MobileNumber":"${mobile}", "AccountName":"${name}", "TransactionId":"${randomText}"}`;
//   str = toEncrypt.replace(/\\/g, '');
//   const encyptRes = await Encrypt(str);

//   const authtoken = await authToken('kiosk', 'kiosk');
//   const response = await axios.post(
//     MbUrl,
//     {
//       PAYLOAD: `${encyptRes}`,
//     },
//     {
//       headers: {
//         'Content-Type': 'application/json',
//         AuthKey: `${channelMgrEncryptURL}`,
//         Authorization: `Bearer ${authtoken}`,
//       },
//     }
//   );
//   if (response.data.CBSNameMatch == 100 && (response.data.CBSMobileMatch == 100 || response.data.BKSMobileMatch == 100)) {
//     const customerInfo = JSON.stringify(user);
//     if (!user.mobileNumber) {
//       user.mobileNumber = mobile;
//     }
//     if (!user.email) {
//       user.email = 'test@email.com';
//     }
//     const key = `CuInfo${account}`;
//     await redis.set(key, customerInfo);
//     return {
//       status: true,
//       data: user,
//     };
//   } else {
//     console.log('Mobile banking validation failed');
//     return {
//       status: false,
//     };
//   }
// };

const customerAuthCBSBackup = async (accountNumber, mobileNumber) => {
  const CbsUrl = `http://192.168.126.74:60064/api/CustomerInquiry/CustomerInquiryRequest`;
  const channelMgrEncryptURL = await HmacSHAEncryptURL('kiosk', 'kiosk', CbsUrl);
  const toEncrypt = `{"opracc":"${accountNumber}"}`;
  str = toEncrypt.replace(/\\/g, '');
  const encyptRes = await Encrypt(str);

  const authtoken = await authToken('kiosk', 'kiosk');
  try {
    const response = await axios.post(
      CbsUrl,
      {
        PAYLOAD: `${encyptRes}`,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          AuthKey: `${channelMgrEncryptURL}`,
          Authorization: `Bearer ${authtoken}`,
        },
      }
    );
    const finalRes = response.data.data;
    const parseResponse = JSON.parse(finalRes);

    if (parseResponse.status == 'failed') {
      return {
        status: false,
        error: 'Invalid Account Number',
      };
    }

    if (parseResponse) {
      const obj = {
        accountNumber: parseResponse.data.accountNo ? parseResponse.data.accountNo : null,
        fullName: parseResponse.data.fullName ? parseResponse.data.fullName : null,
        firstName: parseResponse.data.firstName ? parseResponse.data.firstName : null,
        middleName: parseResponse.data.middleName ? parseResponse.data.middleName : null,
        lastName: parseResponse.data.lastName ? parseResponse.data.lastName : null,
        gender: parseResponse.data.gender ? parseResponse.data.gender : null,
        salutation: parseResponse.data.salutation ? parseResponse.data.salutation : null,
        city: parseResponse.data.city ? parseResponse.data.city : null,
        country: parseResponse.data.country ? parseResponse.data.country : null,
        countryCode: parseResponse.data.countryCode ? parseResponse.data.countryCode : null,
        dob: parseResponse.data.dob ? parseResponse.data.dob : null,
        mobileNumber: parseResponse.data.mobileNo ? parseResponse.data.mobileNo : null,
        email: parseResponse.data.email ? parseResponse.data.email : null,
        address: parseResponse.data.address ? parseResponse.data.address : null,
        citizenshipNo: parseResponse.data.citizenshipNo ? parseResponse.data.citizenshipNo : null,
        chargeProfile: parseResponse.data.chargeProfile ? parseResponse.data.chargeProfile : null,
        branchSol: parseResponse.data.primarySolId ? parseResponse.data.primarySolId : null,
        productType: 'R2',
      };

      const response = await verifyMobileBanking(obj, mobileNumber);
      // const accNo = obj.accountNumber;
      // const customerInfo = JSON.stringify(obj);
      // const key = `CuInfo${accNo}`;
      // await redis.set(key, customerInfo);
      // return {
      //   status: true,
      //   data: parseResponse.data,
      // };
      return response;
    }
  } catch (error) {
    return {
      status: false,
      error,
    };
  }
};

// const statusFromCCMS = async (req, res) => {
//   // const statusId = req.query.status ? req.query.status : RequestStatus.completed;
//   const status = req?.query?.status;
//   let result;
//   switch (status) {
//     case '1':
//       result = 'Requested';
//       break;
//     case '2':
//       result = 'Card Delivery';
//       break;
//     case '3':
//       result = 'Activated';
//       break;
//     default:
//       result = 'Card Delivery';
//       break;
//   }
//   const acNo = req.user.accountNumber;
//   try {
//     const ccmsUrl = 'http://192.168.126.74:60064/api/CustomerCardStatus/CustomerCardStatusRequest';
//     const authtoken = await authToken('kiosk', 'kiosk');
//     const channelMgrEncryptURL = await HmacSHAEncryptURL('kiosk', 'kiosk', ccmsUrl);

//     const identifier = { identifier: acNo };
//     const json=JSON.stringify(identifier);
//     str = identifier.replace(/\\/g, '');
//     // console.log(str,"str");
//     // const encyptRes = await Encrypt(str);
//     const encryptedDataToCCMS = await Encrypt(encyptRes);
//     const response = await axios.post(
//       ccmsUrl,
//       {
//         PAYLOAD: `${encryptedDataToCCMS}`,
//       },
//       {
//         headers: {
//           // AccessToken: `Bearer ${authtoken}`,
//           'Content-Type': 'application/json',
//           AuthKey: `${channelMgrEncryptURL}`,
//           Authorization: `Bearer ${authtoken}`,
//         },
//       }
//     );
//     if (response.data.code == 0) {
//       if (result) {
//         let datatoreact;
//         const filteredData = response.data.data.debit.requestedCards.filter(
//           (value) => (datatoreact = value.status == result)
//         );
//         // console.log(filteredData,"data", result,response.data.data.debit.requestedCards);

//         if (filteredData) {
//           res.json({
//             status: Status.Success,
//             message: response.data.message,
//             data: filteredData,
//           });
//         }
//       }
//     }
//   } catch (error) {
//     res.json({
//       status: Status.Failed,
//       message: 'Failed to get CCMS data.',
//       error,
//     });
//   }
// };

const statusCountFromCCMS = async (req, res) => {
  const acNo = req.user?.accountNumber || '';
  try {
    const ccmsUrl = 'http://192.168.126.74:60064/api/CustomerCardStatus/CustomerCardStatusRequest';
    const authtoken = await authToken('kiosk', 'kiosk');
    const channelMgrEncryptURL = await HmacSHAEncryptURL('kiosk', 'kiosk', ccmsUrl);

    const identifier = { identifier: acNo };
    const json = JSON.stringify(identifier);
    str = json.replace(/\\/g, '');
    // console.log(identifier,"identifier");
    // const xyz={"identifier": "0107010005037"};
    const encryptedDataToCCMS = await Encrypt(str);

    var data = JSON.stringify({
      payload: `${encryptedDataToCCMS}`,
    });

    var config = {
      method: 'get',
      url: ccmsUrl,
      headers: {
        AuthKey: `${channelMgrEncryptURL}`,
        Authorization: `Bearer ${authtoken}`,
        'Content-Type': 'application/json',
      },
      data: data,
    };

    const response = await axios(config)
      .then(function (response) {
        // console.log(JSON.stringify(response.data));
        return response;
      })
      .catch(function (error) {
        console.log(error);
      });

    // const options = {
    //   method: 'GET',
    //   headers: { 'content-type': 'application/x-www-form-urlencoded', 'AuthKey': `${channelMgrEncryptURL}`,
    //   'Authorization': `Bearer ${authtoken}`, },
    //   data:  {
    //     PAYLOAD: `${encryptedDataToCCMS}`,
    //   },
    //   url:ccmsUrl,
    // };
    // const response = await  axios(options);

    // const response = await axios.get(
    //   ccmsUrl,
    //   {
    //     PAYLOAD: `${encryptedDataToCCMS}`,
    //   },
    //   {
    //     headers: {
    //       'Content-Type': 'application/json',
    //       AuthKey: `${channelMgrEncryptURL}`,
    //       Authorization: `Bearer ${authtoken}`,
    //     },
    //   }
    //   );
    // const parseResponse=JSON.parse(response);
    // const getParse =JSON.parse(parseResponse);

    if (response.data.code == 0) {
      // console.log("dssd",response.data.data.debit.requestedCards);
      return response;
      //  return res.json({
      //   status: Status.Success,
      //   message: parseResponse.data.message,
      //   data: response.data.data.debit.requestedCards,
      // });
    }
  } catch (error) {
    // return error
    // console.log("===",error.message,error.config,"kjkj");
    // res.json({
    //   status: Status.Failed,
    //   message: 'Failed to get CCMS data.',
    //   error,
    // });
  }
};

module.exports = {
  authToken,
  redisToken,
  customerAuthCBS,
  branches,
  postToCCMS,
  // statusFromCCMS,
  statusCountFromCCMS,
  customerDetailCRN,
};
