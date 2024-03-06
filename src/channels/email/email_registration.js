const { OtpEmailLogs } = require('../../models');

const EMAIL_STATUS = {
  FAILED: 'FAILED',
  SENT: 'SENT',
};

const EMAIL_TYPE = {
  EMAIL_REGISTER: 'REGISTER_REQUEST_VERIFICATION',
  EMAIL_LOGIN: 'REGISTER_REQUEST_VERIFICATION',
  EMAIL_SWIFT: 'SWIFT_REQUEST_VERIFICATION',
};

/**
 * Create email logs
 */
module.exports.createRegistraionMailLogs = async (args, info) => {
  console.log("====================== CREATING OTP MAIL LOG =================")
  const from = 'GLOBAL IME BANK';
  const to = args.to;
  const subject = args.subject;
  const text = args.text;
  const emailStatus = info.messageId ? EMAIL_STATUS.SENT : EMAIL_STATUS.FAILED;
  const cc = '';
  let message = info.response || '';
  let type = EMAIL_TYPE.EMAIL_LOGIN;
  let isDeleted = 0;
  try {
    await OtpEmailLogs.create({
      sender: from,
      receiver: to,
      password: '',
      subject: subject,
      body: '',
      text: text,
      emailStatus: emailStatus,
      cc: cc,
      message: message,
      type: type,
      isDeleted: isDeleted,
    });
  } catch (err) {
    console.log(err.message, '========= ERROR CREATING EMAIL LOG ============');
  }
};
