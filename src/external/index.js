const axios = require('axios');
const url = process.env.CUSTOMER_VERIFICATION;

const authenticate = async (accountNumber, mobileNumber) => {
  try {
    const response = await axios.get(`${url}/CustomerDetails?acctNo=${accountNumber}&mobileNo=${mobileNumber}`, {
      auth: {
        username: 'gentech123@sunrisebank.com.np',
        password: 'Gentech@123',
      },
    });
    return {
      status: true,
      data: response.data[0],
    };
  } catch (error) {
    return {
      status: false,
      error,
    };
  }
};

module.exports = {
  authenticate,
};
