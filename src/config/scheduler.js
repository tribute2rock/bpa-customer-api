const schedule = require('node-schedule');
const {emptyTemp} = require('./ftpConfig');

schedule.scheduleJob('59 23 * * 6', function () {
  console.log('Temp folder clear - scheduler running!');
  emptyTemp('temp/');
});
