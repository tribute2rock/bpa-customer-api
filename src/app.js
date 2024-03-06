const express = require('express');
require('express-async-errors');
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const compression = require('compression');
const ErrorHandler = require('./errors/handlers');
const config = require('./config');
const morgan = require('./config/morgan');
const routes = require('./routes');
const xss = require('xss-clean');
const http2 = require('http2');
const fs = require('fs');
const robots = require('express-robots-txt');
const { expressCspHeader, INLINE, NONE, SELF, EVAL, NONCE } = require('express-csp-header');
const path = require('path');

let app = express();
if (config.env !== 'test') {
  app.use(morgan.successHandler);
  app.use(morgan.errorHandler);
}

app.use(function (req, res, next) {
  res.removeHeader('X-Powered-By');
  next();
});

app.use((req, res, next) => {
  const crypto = require('crypto');

  function createSha256CspHash(content) {
    return 'sha256-' + crypto.createHash('sha256').update(content).digest('base64');
  }

  res.locals.cspNonce = crypto.randomBytes(16).toString('hex');
  next();
});

// app.use(
//   robots({
//     UserAgent: '*',
//     Disallow: '/',
//     CrawlDelay: '5',
//     Sitemap: 'https://nowhere.com/sitemap.xml',
//   })
// );

// set security HTTP headers
app.use(helmet());
app.use(
  expressCspHeader({
    directives: {
      'default-src': [
        SELF,
        INLINE,
        // 'https://fonts.googleapis.com',
        // 'https://fonts.gstatic.com/recaptcha',
        // 'https://fonts.gstatic.com/s/roboto',
        // 'https://www.gstatic.com',
        'http://bank.gibl.bpa',
        'http://localhost',
        'https://globalconnect.gibl.com.np',
        'https://globalimebank.com',
        "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='"
      ],
      'script-src': [ SELF, INLINE,EVAL],
      'style-src':[SELF, INLINE],

      // 'style-src':[SELF,"'sha256-7VXlcg/uSZugHSa6UtIG2/44ju460LiO4M0CyQfraX8='"],
      // 'script-src': [SELF, EVAL, "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",],
      // 'style-src-elem': [SELF,INLINE, 'https://fonts.googleapis.com/css', "'sha256-7r2ujmheqiX51mvWs8fn568hDcTrFmhz6Fl1dthwZJI='","'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='"],
      // 'font-src': [SELF, 'https://fonts.gstatic.com/s/roboto'],
      'worker-src': [NONE],
      'img-src': ['blob:','data:', 
      'http://bank.gibl.bpa',
      ,'https://globalconnect.gibl.com.np','https://globalimebank.com'],
      // 'block-all-mixed-content': true,
    },
  })
);

// app.use(
//   expressCspHeader({
//     directives: {
//       'default-src': [
//         SELF,
//         INLINE,
//         'https://fonts.googleapis.com',

//         'https://fonts.gstatic.com/recaptcha',
//         'https://fonts.gstatic.com/s/roboto',
//         'https://www.gstatic.com',
//         'http://localhost:8080',
//         'http://192.168.214.73:8080',
//         'http://192.168.214.74:8080',
//         'http://localhost',
//         'https://globalconnect.gibl.com.np',
//         'https://globalimebank.com',
//         "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='"
//       ],
//       'script-src': [ SELF, INLINE,EVAL],
//       'style-src':[SELF, INLINE],

//       // 'style-src':[SELF,"'sha256-7VXlcg/uSZugHSa6UtIG2/44ju460LiO4M0CyQfraX8='"],
//       // 'script-src': [SELF, EVAL, "'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='",],
//       // 'style-src-elem': [SELF,INLINE, 'https://fonts.googleapis.com/css', "'sha256-7r2ujmheqiX51mvWs8fn568hDcTrFmhz6Fl1dthwZJI='","'sha256-47DEQpj8HBSa+/TImW+5JCeuQeRkm5NMpJWZG3hSuFU='"],
//       // 'font-src': [SELF, 'https://fonts.gstatic.com/s/roboto'],
//       'worker-src': [NONE],
//       'img-src': ['blob:','data:', 'http://192.168.214.74:8080','https://globalconnect.gibl.com.np','https://globalimebank.com'],
//       // 'block-all-mixed-content': true,
//     },
//   })
// );

// parse json request body
app.use(bodyParser.json());

// parse urlencoded request body
app.use(bodyParser.urlencoded({ extended: true }));

// sanitize request data
app.use(xss());

// gzip compression
app.use(compression());

var whitelist = [
  'http://localhost',
  'http://localhost:8081',
  'http://localhost:8080',
  'http://192.168.126.73:8080',
  'http://192.168.126.74:8080',
  'https://globalconnect.gibl.com.np',
  'https://globalconnect.gibl.com.np:8081',
  'https://544e-2400-1a00-b040-b7e6-2526-df80-c2a4-1984.in.ngrok.io',
];

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

// enable cors
// app.use(cors(corsOptions));
app.use(cors());

app.use('/', express.static('./public'));

app.use('/api', routes);

app.use(ErrorHandler);

require('./config/database');

module.exports = app;
// module.exports = https2;
