// const multer = require('multer');
// const MULTER_FILE_PATH = process.env.MULTER_FILE_PATH;

// const fileStorageEngine = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, `${MULTER_FILE_PATH}`);
//   },
//   filename: (req, file, cb) => {
//     cb(null, `${Date.now()}--${file.originalname}`);
//   },
// });

// const uploader = multer({ storage: fileStorageEngine });

// module.exports = uploader;

const { FTP } = require('./index');
const multer = require('multer');
const path = require('path');
const MULTER_FILE_PATH = process.env.MULTER_FILE_PATH;
var FTPStorage = require('multer-ftp-storage');

const ftpStorageEngine = new FTPStorage({
  basepath: '/',
  ftp_config: {
    host: FTP.HOST,
    secure: false, // enables FTPS/FTP with TLS
    user: FTP.USERNAME,
    password: FTP.PASSWORD,
  },
});

const ftpUploader = multer({
  storage: ftpStorageEngine,
});

function fileUpload(req, res, next) {
  ftpUploader.any()(req, res, next);
}

module.exports = fileUpload;
