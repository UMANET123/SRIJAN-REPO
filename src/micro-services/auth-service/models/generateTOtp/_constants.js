/**
 * * All Constants
 */

//  User Block limit for Resend OTP in mins
const BLOCK_USER_LIMIT = 30;
//  OTP exipiry time in mins
const OTP_EXPIRY_TIME = 5;
//  OTP retry in number
const OTP_RETRY_LIMIT = 3;

module.exports = { BLOCK_USER_LIMIT, OTP_EXPIRY_TIME, OTP_RETRY_LIMIT };
