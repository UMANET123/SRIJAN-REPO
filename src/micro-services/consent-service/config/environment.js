
require('dotenv').config();
const ENV = process.env;


//  node server settings
const NODE_SETTINGS = {
    portNumber : ENV.PORT_NUMBER || 3002,
    nodeEnv : ENV.NODE_ENV || 'dev'
}


//  node DB configuration
const DB_SETTINGS = {
    user : ENV.DB_USERNAME,
    password : ENV.DB_PASSWORD,
    host : ENV.DB_HOST || "db",
    port : ENV.DB_PORT || "5432",
    database: ENV.DB_NAME
}
const CONSENT_BASE_PATH= `/subscriber/v1`;

const CONSENT_REVOKE_APP_URL = ENV.ENV_CONSENT_APP_REVOKE_URL;

module.exports = { NODE_SETTINGS,  DB_SETTINGS, CONSENT_BASE_PATH, CONSENT_REVOKE_APP_URL};