
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

const S3_BUCKET_SETTINGS = {
    name:ENV.ENV_S3_BUCKET_NAME,
    access_key_id:ENV.ENV_S3_ACCESS_KEY_ID,
    secret_key_id:ENV.ENV_SECRET_ACCESS_KEY,
    folder:ENV.ENV_S3_BUCKET_FOLDER
}

module.exports = { NODE_SETTINGS,  DB_SETTINGS, CONSENT_BASE_PATH, S3_BUCKET_SETTINGS };