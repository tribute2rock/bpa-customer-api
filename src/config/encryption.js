const CryptoJS = require('crypto-js');
const { HTTP, Status } = require('../constants/response');

const encrypt = (params) => {
  let o = `${JSON.stringify(params)}`;
  let encryptdata;
  const key = CryptoJS.enc.Utf8.parse('1234567890000000');
  const iv = CryptoJS.enc.Utf8.parse('1234567890000000');
  if (typeof o === 'string') {
    if (o) {
      var srcs = CryptoJS.enc.Utf8.parse(o);
      encryptdata = CryptoJS.AES.encrypt(srcs, key, {
        keySize: 128 / 8,
        iv: iv,
        mode: CryptoJS.mode.CBC,
        padding: CryptoJS.pad.Pkcs7,
      }).toString();
    }
  } else if (typeof o === 'object') {
    for (var _o in o) {
      if (o[_o]) {
        var srcs = CryptoJS.enc.Utf8.parse(o[_o]);
        o[_o] = CryptoJS.AES.encrypt(srcs, key, {
          keySize: 128 / 8,
          iv: iv,
          mode: CryptoJS.mode.CBC,
          padding: CryptoJS.pad.Pkcs7,
        }).toString();
      }
    }
  }
  console.log(encryptdata);
  res.status(HTTP.StatusOk).json({
    status: Status.Success,
    message: '',
    data: encryptdata,
  });
};

module.exports = encrypt;
