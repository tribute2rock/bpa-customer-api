const winston = require('winston');
const config = require('./index');
require("winston-daily-rotate-file");
var path = require("path");

var transport = new winston.transports.DailyRotateFile({
  filename: path.join("logs", "application-%DATE%.log"),
  datePattern: "YYYY-MM-DD-HH",
  zippedArchive: true,
  frequency: '12h'
});

const enumerateErrorFormat = winston.format((info) => {
  if (info instanceof Error) {
    Object.assign(info, { message: info.stack });
  }
  return info;
});

const logger = winston.createLogger({
  // transports: [transport],
  // level: config.env === 'development' ? 'debug' : 'info',
  // format: winston.format.combine(
  //   enumerateErrorFormat(),
  //   config.env === 'development' ? winston.format.colorize() : winston.format.uncolorize(),
  //   winston.format.splat(),
  //   winston.format.printf(({ level, message }) => `${level}: ${message}`)
  // ),
});

module.exports = logger;
