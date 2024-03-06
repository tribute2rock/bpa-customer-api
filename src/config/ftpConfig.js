const { ftp, config, checkFtp } = require('./filesystem');
const rimraf = require('rimraf');
const fs = require('fs');
const path = require('path');

async function uploadAttachments(attachments) {
  const isConnected = await new Promise((resolve) => checkFtp((isConnected) => resolve(isConnected)));
  if (isConnected) {
    ftp.connect(config);
    const uploadArr = attachments.map((att) => {
      return {
        remote: att.filePath,
        local: att.localPath,
      };
    });
    const isSuccess = await new Promise((resolve) => {
      ftp.upload(uploadArr, '/', (err) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
    if (isSuccess) {
      await Promise.all(
        attachments.map((attachment) => {
          return Attachment.create(attachment);
        })
      );
    }
    ftp.close();
    return isSuccess;
  } else {
    return false;
  }
}

async function downloadAttachmentFromFtp(localPath, ftpPath) {
  const isConnected = await new Promise((resolve) => checkFtp((isConnected) => resolve(isConnected)));
  if (isConnected) {
    ftp.connect(config);
    const isSuccess = await new Promise((resolve) => {
      ftp.download(ftpPath, localPath, (err) => {
        if (err) {
          console.log(err);
          resolve(false);
        } else {
          resolve(true);
        }
      });
    });
    ftp.close();
    return isSuccess;
  } else {
    return false;
  }
}

function emptyTemp(tempPath) {
  tempPath = tempPath ? tempPath : 'temp/';
  fs.readdir(tempPath, (err, files) => {
    if (err) throw err;
    for (const file of files) {
      fs.unlink(path.join(tempPath, file), (err) => {
        if (err) {
          rimraf(path.join(tempPath, file), () => {});
        }
      });
    }
  });
}

module.exports = {
  uploadAttachments,
  downloadAttachmentFromFtp,
  emptyTemp,
};
