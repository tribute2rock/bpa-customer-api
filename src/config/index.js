const dotenv = require('dotenv');
const path = require('path');
const Joi = require('joi');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const envVarsSchema = Joi.object()
  .keys({
    NODE_ENV: Joi.string().valid('production', 'development', 'test').required(),
    PORT: Joi.number().default(3000),
    URL: Joi.string().default('http://localhost:3000'),
    JWT_SECRET: Joi.string().required(),
    ACCESS_TOKEN_EXPIRY: Joi.number().default(900),
    REFRESH_TOKEN_EXPIRY: Joi.number().default(3600),
    DB_NAME: Joi.string().required(),
    DB_DIALECT: Joi.string().valid('mysql', 'mssql').default('mssql'),
    DB_HOST: Joi.string().default('localhost'),
    DB_PORT: Joi.number().default(1433),
    DB_USERNAME: Joi.string().default('sa'),
    DB_PASSWORD: Joi.string().default(''),
    EMAIL_HOST: Joi.string(),
    EMAIL_PORT: Joi.number(),
    EMAIL_USERNAME: Joi.string(),
    EMAIL_PASSWORD: Joi.string(),
    EMAIL_SECURE: Joi.string(),
    REDIS_HOST: Joi.string().default('127.0.0.1'),
    REDIS_PORT: Joi.number().default(6379),
    REDIS_PASSWORD: Joi.string(),
  })
  .unknown();

const { value: envVars, error } = envVarsSchema.prefs({ errors: { label: 'key' } }).validate(process.env);

if (error) {
  throw new Error(`Config validation error: ${error.message}`);
}

module.exports = {
  env: envVars.NODE_ENV,
  port: envVars.PORT,
  URL: envVars.URL,
};
module.exports.JWT = {
  SECRET: envVars.JWT_SECRET,
  ACCESS_TOKEN_EXPIRY: envVars.ACCESS_TOKEN_EXPIRY,
  REFRESH_TOKEN_EXPIRY: envVars.REFRESH_TOKEN_EXPIRY,
};
module.exports.TO_DMS = {
  UPLOAD_TO_DMS: envVars.TO_DMS,
};
module.exports.DB = {
  NAME: envVars.DB_NAME,
  DIALECT: envVars.DB_DIALECT,
  HOST: envVars.DB_HOST,
  PORT: envVars.DB_PORT,
  USERNAME: envVars.DB_USERNAME,
  PASSWORD: envVars.DB_PASSWORD,
};
module.exports.EMAIL = {
  HOST: envVars.EMAIL_HOST,
  PORT: envVars.EMAIL_PORT,
  USERNAME: envVars.EMAIL_USERNAME,
  PASSWORD: envVars.EMAIL_PASSWORD,
  SECURE: envVars.EMAIL_SECURE,
};
module.exports.REDIS = {
  HOST: envVars.REDIS_HOST,
  PORT: envVars.REDIS_PORT,
  PASSWORD: envVars.REDIS_PASSWORD,
};

module.exports.FTP = {
  HOST: process.env.FTP_HOST,
  PORT: process.env.FTP_PORT,
  USERNAME: process.env.FTP_USERNAME,
  PASSWORD: process.env.FTP_PASSWORD,
  TYPE: process.env.FTP_TYPE,
};