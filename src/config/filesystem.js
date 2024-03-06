const multer = require('multer');
const { FTP } = require('./index');
const FTPClient = require('ftp');
var EasyFtp = require('easy-ftp');

/**
 * Creating a storage to store file uploaded by the user to later upload to the FTP server
 * This function is of **multer**
 */
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'temp');
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + '-' + file.originalname);
  },
});

var ftp = new EasyFtp();
var config = {
  host: FTP.HOST,
  port: FTP.PORT,
  username: FTP.USERNAME,
  password: FTP.PASSWORD,
  type: FTP.TYPE,
};

/**
 *
 * @method
 * @param {Function} callback
 * @returns {Boolean} Whether the FTP is connected or not
 */
const checkFtp = (callback) => {
  const ftpClient = new FTPClient();

  const configClient = {
    host: FTP.HOST,
    port: 21,
    user: FTP.USERNAME,
    password: FTP.PASSWORD,
    // connTimeout: 300000,
  };
  ftpClient.connect(configClient);
  ftpClient.on('ready', () => {
    callback(true);
  });
  ftpClient.on('error', () => {
    console.log('Ftp not connected', configClient);
    callback(false);
  });
};

async function checkFTPconnection() {
  const ftpClient = new FTPClient();

  const configClient = {
    host: FTP.HOST,
    port: 21,
    user: FTP.USERNAME,
    password: FTP.PASSWORD,
    // connTimeout: 300000,
  };
  await ftpClient.connect(configClient);
  await ftpClient.on('ready', () => {
    return true;
  });
  await ftpClient.on('error', () => {
    console.log('Ftp not connected', configClient);

    throw new Error('FTP not connected - Please check ftp server');
  });
}

module.exports = {
  ftp,
  storage,
  config,
  checkFtp,
  checkFTPconnection,
};
