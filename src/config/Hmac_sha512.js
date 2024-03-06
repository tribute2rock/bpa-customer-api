const sha512 = require('sha512');
const key = 'super secret';
const crypto = require('crypto');

const getSecurePassword = (password, salt, algo) => {
  const algoFormatted = algo.toLowerCase().replace('-', '');
  const hash = crypto.createHash(algoFormatted);
  hash.update(salt + password);
  console.log(hash.digest('hex'));
};

// console.log(getSecurePassword('test', 'test', 'SHA-512'));

const hmacFun = (params) => {
  var hmac = crypto.createHmac('sha512', 'yoursecretkeyhere');
  //passing the data to be hashed
  data = hmac.update('http://192.168.1.98:60064/api/JwtToken/GetToken');
  //Creating the hmac in the required format
  gen_hmac = data.digest('hex');
  //Printing the output on the console
  console.log(gen_hmac);
};

module.exports = {
  getSecurePassword,
  hmacFun,
};
