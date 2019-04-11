require("dotenv").config();
const ENV = process.env;

//  node server settings
const NODE_SETTINGS = {
  portNumber: ENV.PORT_NUMBER || 3000,
  nodeEnv: ENV.NODE_ENV || "dev"
};

//  node server settings
const APIGEE_CREDS = {
  clientID: ENV.CLIENT_ID || 3000,
  clientSecret: ENV.SECRET || "dev",
  apigeeBaseURL: ENV.APIGEE_BASE_URL
};

const APIGEE_BASE = "auth/v2";
//  node server settings
const APIGEE_ENDPOINTS = {
  generateOTP: `${APIGEE_BASE}/generate/otp`,
  verifyOTP: `${APIGEE_BASE}/verify/otp`,
  updateConsent: `${APIGEE_BASE}/consent`,
  validateTransaction: `${APIGEE_BASE}/transaction`
};

module.exports = { NODE_SETTINGS, APIGEE_CREDS, APIGEE_ENDPOINTS, APIGEE_BASE };
