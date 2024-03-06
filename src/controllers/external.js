const axios = require('axios');
const urlFee = process.env.FEE_STRUCTURE;
const branchesUrl = process.env.BRANCH_URL;
const merchantsUrl = process.env.MERCHANTS_URL;
const chargeURL = process.env.CHARGE_PROFILE;
const branchURL = process.env.BRANCH_LIST;
const productURL = process.env.PRODUCT_TYPE_LIST;
const customerURL = process.env.CUSTOMER_DETAIL;
const API_URL = process.env.API_URL;

const branches = async (req, res) => {
  try {
    const response = await axios.get(branchesUrl);
    const items = [];
    for (let i = 0; i < response.data.length; i++) {
      const item = {
        text: response.data[i].BranchName,
        value: response.data[i].BranchName,
      };
      items.push(item);
    }
    return res.send(items);
  } catch (e) {
    // console.log(e);
    return res.send([]);
  }
};

const merchants = async (req, res) => {
  try {
    const response = await axios.get(merchantsUrl);
    const items = [];
    for (let i = 0; i < response.data.length; i++) {
      const item = {
        text: response.data[i].merchant_name,
        value: response.data[i].merchant_name,
      };
      items.push(item);
    }
    return res.send(items);
  } catch (e) {
    // console.log(e);
    return res.send([]);
  }
};

const cardBrands = async (req, res) => {
  res.send([
    {
      text: 'Visa Card',
      value: 'Visa Card',
    },
    {
      text: 'Master Card',
      value: 'Master Card',
    },
  ]);
};

const fees = async (req, res) => {
  try {
    const response = await axios.get(`${urlFee}/validate?profileId=${req.query.profileId}&feeType=${req.query.feeType}`, {
      auth: {
        username: 'gentech123@sunrisebank.com.np',
        password: 'Gentech@123',
      },
    });
    const data = response.data;
    const fees = { value: data?.fee };
    res.send(fees);
  } catch (e) {
    return {};
  }
};

const paymentOptions = async (req, res) => {
  res.send([
    {
      text: '5%',
      value: '5%',
    },
    {
      text: '100%',
      value: '100%',
    },
  ]);
};

const cardTypes = async (req, res) => {
  res.send([
    {
      text: 'Visa Debit Card',
      value: 'Visa Debit Card',
    },
    {
      text: 'Visa Credit Card',
      value: 'Visa Credit Card',
    },
    {
      text: 'Master Card',
      value: 'Master Card',
    },
  ]);
};

const ubRequestTypes = async (req, res) => {
  res.send([
    {
      text: 'Block',
      value: 'Block',
    },
    {
      text: 'Unblock',
      value: 'Unblock',
    },
  ]);
};

const transactionModes = async (req, res) => {
  res.send([
    {
      text: 'ATM Transaction',
      value: 'ATM Transaction',
    },
    {
      text: 'POS Transaction',
      value: 'POS Transaction',
    },
    {
      text: 'E-com Transaction',
      value: 'E-com Transaction',
    },
    {
      text: 'Mobile Banking',
      value: 'Mobile Banking',
    },
    {
      text: 'E-banking transaction',
      value: 'E-banking transaction',
    },
  ]);
};

//Global-Bank
const branchList = async (req, res) => {
  const response = await axios.post(API_URL + branchURL);
  const items = [];
  if (response.data.code === 0 && response.data?.data) {
    for (let i = 0; i < response.data.data.length; i++) {
      const item = {
        text: response.data.data[i].name,
        value: response.data.data[i].code,
      };
      items.push(item);
    }
  }
  return res.send(items);
};

const chargeList = async (req, res) => {
  const response = await axios.post(API_URL + chargeURL);
  const items = [];
  if (response.data.code === 0 && response.data?.data) {
    for (let i = 0; i < response.data.data.length; i++) {
      const item = {
        text: response.data.data[i].name,
        value: response.data.data[i].id,
      };
      items.push(item);
    }
  }
  return res.send(items);
};

const productList = async (req, res) => {
  const response = await axios.post(API_URL + productURL);
  const items = [];
  if (response.data.code === 0 && response.data?.data) {
    for (let i = 0; i < response.data.data.length; i++) {
      const item = {
        text: response.data.data[i].description,
        value: response.data.data[i].code,
      };
      items.push(item);
    }
  }
  return res.send(items);
};

const customerDetail = async (req, res) => {
  const response = await axios.post(API_URL + customerURL);
  let items = {};
  if (response.data.code === 0 && response.data?.data) {
    items = response.data.data;
  }
  return res.send(items);
};

module.exports = {
  branches,
  merchants,
  cardBrands,
  fees,
  paymentOptions,
  cardTypes,
  ubRequestTypes,
  transactionModes,
  branchList,
  chargeList,
  productList,
  customerDetail,
};
