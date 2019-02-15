
require('dotenv').config();
const ENV = process.env;


//  node server settings
const NODE_SETTINGS = {
    portNumber : ENV.PORT_NUMBER || 3000,
    nodeEnv : ENV.NODE_ENV || 'dev'
}

//  node server settings
const APIGEE_CREDS = {
    clientID : ENV.CLIENT_ID || 3000,
    clientSecret : ENV.SECRET || 'dev',
    apigeeBaseURL : ENV.APIGEE_BASE_URL
}

//  node server settings
const APIGEE_ENDPOINTS = {
    generateOTP : "auth/v1/generate/otp",
    verifyOTP: "auth/v1/verify/otp"
}


module.exports = { NODE_SETTINGS,APIGEE_CREDS, APIGEE_ENDPOINTS};