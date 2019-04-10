
require('dotenv').config();
const ENV = process.env;


//  node server settings
const NODE_SETTINGS = {
    portNumber : ENV.PORT_NUMBER || 3000,
    nodeEnv : ENV.NODE_ENV || 'dev'
}

// OTP Settings
const OTP_SETTINGS = {
    timer : ENV.OTP_TIMER || 5,
    step : parseInt(ENV.OTP_STEP) || 60
}

//  Email configuration
const EMAIL_SETTINGS = {
    username : ENV.EMAIL_USERNAME,
    password : ENV.EMAIL_PASSWORD,
    host : ENV.EMAIL_HOST,
    port : ENV.EMAIL_PORT
}

//  node DB configuration
const DB_SETTINGS = {
    user : ENV.DB_USERNAME,
    password : ENV.DB_PASSWORD,
    host : ENV.DB_HOST || "db",
    port : ENV.DB_PORT || "5432",
    database: ENV.DB_NAME
}

const S3_BUCKET_SETTINGS = {
    name:ENV.ENV_S3_BUCKET_NAME,
    access_key_id:ENV.ENV_S3_ACCESS_KEY_ID,
    secret_key_id:ENV.ENV_SECRET_ACCESS_KEY,
    folder:ENV.ENV_S3_BUCKET_FOLDER
}
const AUTH_BASE_PATH = `/auth/v1`;
module.exports = { NODE_SETTINGS, OTP_SETTINGS, DB_SETTINGS, EMAIL_SETTINGS, AUTH_BASE_PATH, S3_BUCKET_SETTINGS};