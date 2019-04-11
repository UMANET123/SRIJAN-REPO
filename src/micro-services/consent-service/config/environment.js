
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

const AUTH_KEYS = {
    auth_client_id: ENV.AUTH_CLIENT_ID || 'authjshdkjhas8sdandsakdadkad23',
    auth_secret_message: ENV.AUTH_CLIENT_SECRET || 'secretmessageauthhgjgdsadb4343'
}
//Consent Authentication Keys
const CONSENT_KEYS = {
    consent_client_id: ENV.CONSENT_CLIENT_ID || 'consentjshdkjhas8sdandsakdadkad23',
    consent_secret_message: ENV.CONSENT_CLIENT_SECRET || 'secretmessageconsenthgjgdsadb4343'
}
const CONSENT_BASE_PATH= `/subscriber/v1`;
const AUTHENTICATION_ACTIVE = ENV.AUTHENTICATION_ACTIVE || "false";

module.exports = { NODE_SETTINGS,  DB_SETTINGS, CONSENT_BASE_PATH, AUTH_KEYS, CONSENT_KEYS, AUTHENTICATION_ACTIVE};