const crypto = require('crypto');
var CryptoJS = require('crypto-js');
const Pbkdf2 = require('nodejs-pbkdf2');
const { HTTP, Status } = require('../constants/response');

let alice = crypto.createECDH('secp256k1');
alice.generateKeys();

let bob = crypto.createECDH('secp256k1');
bob.generateKeys();

let alicePublicKeyBase64 = alice.getPublicKey().toString('base64');
let bobPublicKeyBase64 = bob.getPublicKey().toString('base64');

let aliceSharedKey = alice.computeSecret(bobPublicKeyBase64, 'base64', 'hex');
let bobSharedKey = bob.computeSecret(alicePublicKeyBase64, 'base64', 'hex');

const key = (req, res) => {
  console.log(aliceSharedKey === bobSharedKey);
  console.log('Alice shared Key: ', aliceSharedKey);
  console.log('Bob shared Key: ', bobSharedKey);

  res.status(HTTP.StatusOk).json({
    status: Status.Success,
    message: '',
    data: bobSharedKey,
  });
};
const encryption = (req, res) => {
  // console.log(categories[0]);
  //   const enc = categories[0];
  const MESSAGE = `${{ Username: 'kiosk', Password: 'kiosk' }}`;
  console.log(MESSAGE);

  const Iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-gcm', Buffer.from(aliceSharedKey, 'hex'), IV);

  let encrypted = cipher.update(MESSAGE, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  const auth_tag = cipher.getAuthTag().toString('hex');

  console.table({
    IV: IV.toString('hex'),
    encrypted: encrypted,
    auth_tag: auth_tag,
  });

  const payload = IV.toString('hex') + encrypted + auth_tag;

  const payload64 = Buffer.from(payload, 'hex').toString('base64');

  //Bob will do from here
  const bob_payload = Buffer.from(payload64, 'base64').toString('hex');
  console.log(bob_payload);

  const IV = bob_payload.substr(0, 32);
  const encryptedData = bob_payload.substr(32, bob_payload.length - 32 - 32);
  const authTag = bob_payload.substr(bob_payload.length - 32, 32);
  const output = { IV, encryptedData, authTag };
  console.log(output);

  res.status(HTTP.StatusOk).json({
    status: Status.Success,
    message: '',
    data: output,
  });
};

const decryption = (req, res) => {
  try {
    const decipher = crypto.createDecipheriv('aes-256-gcm', Buffer.from(bobSharedKey, 'hex'), Buffer.from(bob_iv, 'hex'));

    decipher.setAuthTag(Buffer.from(bob_auth_tag, 'hex'));

    let decrypted = decipher.update(bob_encrypted, 'hex', 'utf8');
    decrypted += decipher.final('utf8');

    // const tes = JSON.parse(decrypted);
    console.log(decrypted);
    // console.log(decrypted[0]);
    // console.table({ DecyptedMessage: [decrypted] });
  } catch (error) {
    console.log(error.message);
  }
};

const lossData = (req, res) => {
  const config = {
    digestAlgorithm: 'sha1',
    keyLen: 256,
    saltSize: 32,
    iterations: 15000,
  };
  let pbkdf2 = new Pbkdf2(config);
  pbkdf2.hashPassword('12345', (err, cipherText, salt) => {
    console.log(cipherText);
    console.log(salt);
  });
  //   var hash = function (password, salt) {
  //     var pass = crypto.pbkdf2Sync(password, salt, 1333, 32);
  //     var datato = new Buffer(pass).toString('base64');
  //     console.log(datato);
  //   };
  //   res.status(HTTP.StatusOk).json({
  //     status: Status.Success,
  //     message: '',
  //     data: datato,
  //   });
};

const Encrypt = async (encryptString) => {
  // let o = `${JSON.stringify({ Username: usrname, Password: pwd })}`;
  let o = encryptString;
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
  return encryptdata;
  // res.status(HTTP.StatusOk).json({
  //   status: Status.Success,
  //   message: '',
  //   data: encryptdata,
  // });
};
const Decrypt = (req, res) => {
  let str =
    'Ptcq6c3NPIrimMyaG/0DFZ3j/y1LAjKiPokbVuFpOKD+IXhVLkIP5yCzfxsA2z+4um7hdso+Rv/WYVXDHh46fjkvbnMBd+OFaPT8fXhxl76qXVo3WByS6NpybR6ujPHZYx24KNglUx7XLJlBTVHPwwejtyxyvRW21CLUk8M1OxcuLYKR/a2ZQaGnmoFF7n49LAoGPlj6AbELuNps3h0IooahWDC5K0bVN3vm2bN3Hl158avSplhjrjRS2WeoAqTApQc12yLcxappjqvp4TQCI0Dq5xurVWWJNN8hpkV5gWPYSHYe38QkgHB7UnHnCc3+jNKk8AWYENuE1Y0+UC5P3bcuwCCumXa+qQhoeyQPMpjVeuupYkqZEXuqPnDbsCXlK8za2A06Vbayxr8ILHn+PWDTBnQekBMezREOG3ANJEFC6CzGaxvwR9NMaSyV+w2t5nLzLLQbYTYKlbBQ2Q16Lv9yuzKWblyHLPClKgrFgmF3eTzI/xn7pjXWRI9R6BrizMMUrm1RQ+6hfmVnzqOLU03z2GVynFW11iesmv5ym/LSV4iKfFBIo6citXFZdeJ4+H+/KehnNkOObpCqyVBV/Q0LDofy8I5g6lsaThYIygpQ4HZE5KnXxHpKm6OCRc8nf8r2sAuguJMs9pQMSwT3B+FVwW1d/1rxATUPMrEfld3Whtz8u6DhRG/3CX/Zeuv1IuviJyFtYBKLkU8WBI3jRs8D9E1v1gJ10/vLVogxp6jRTM30KghBX8zgQ+Ss+MD0BQVx2ajj1CcK3MseRH7QWng559AM1UBzKxVCS3d31zJfZV+8A1dmNKqalKHU5HpEjZFc8D4ZyXPEajvwx8vB5o7+aiGMzrITKI5zzVMwy/vvNM+iduTYerDTkSwhxCQt';
  const key = CryptoJS.enc.Utf8.parse('1234567890000000');
  const iv = CryptoJS.enc.Utf8.parse('1234567890000000');
  var decrypt = CryptoJS.AES.decrypt(str, key, {
    keySize: 128 / 8,
    iv: iv,
    mode: CryptoJS.mode.CBC,
    padding: CryptoJS.pad.Pkcs7,
  });
  var decryptedStr = decrypt.toString(CryptoJS.enc.Utf8);
  console.log(decryptedStr);
  res.status(HTTP.StatusOk).json({
    status: Status.Success,
    message: '',
    data: JSON.parse(decryptedStr),
  });
};

const HmacSHAEncryptURL = (usrname, pwd, url) => {
  let secret = `${JSON.stringify({ Username: usrname, Password: pwd })}`;
  let hmacRes = crypto.createHmac('sha512', secret).update(url).digest('hex');
  return hmacRes;
};

const HmacSHAEncryptURLNew = (usrname, pwd, url) => {
  // let secret = `${JSON.stringify({ Username: usrname, Password: pwd })}`;
  let hmacRes = crypto.createHmac('sha512', 'bpm:bpm').update(url).digest('hex');
  return hmacRes;
};

module.exports = {
  key,
  encryption,
  decryption,
  lossData,
  Encrypt,
  Decrypt,
  HmacSHAEncryptURL,
  HmacSHAEncryptURLNew,
};
