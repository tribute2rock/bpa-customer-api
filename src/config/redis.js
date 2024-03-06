const redis = require('redis');
const { REDIS }  = require('./index');


const client = redis.createClient({
  host: REDIS.HOST,
  port: REDIS.PORT,
  password: REDIS.PASSWORD,
});

client.on('error', function(error) {
  console.error(error);
});



module.exports = client;
