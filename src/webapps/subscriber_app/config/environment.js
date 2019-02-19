
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
    generateOTP : "dashboard/v1/generate/otp",
    verifyOTP: "dashboard/v1/verify/otp",
    consentList: "dashboard/v1/consent",
    refreshToken: "dashboard/v1/refresh/token",
    revokeApp: "dashboard/v1/revoke/:client_id",

}


module.exports = { NODE_SETTINGS,APIGEE_CREDS, APIGEE_ENDPOINTS};
