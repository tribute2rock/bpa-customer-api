var whitelist = ['http://localhost', 'http://localhost:8081', 'http://localhost:3000', 'http://localhost:8181'];

var corsOptions = {
  origin: function (origin, callback) {
    if (whitelist.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      console.log(origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
};

module.exports = { corsOptions, whitelist };
