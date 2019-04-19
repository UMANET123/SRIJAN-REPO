const { configureOTP } = require("../helper.model");
const updatePhoneNo = require("../../helpers/mobile-number.modify");
const processOTP = require("./_processOTP");
/**
 * Generate TOTP
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {boolean} blacklist Blacklist condition
 * @param {function} resolve Callback on return
 * @returns {function} Call back with message and status
 */
function generateTOtp(msisdn, app_id, blacklistCheckOn) {
  msisdn = updatePhoneNo(msisdn);
  //  update otp settings
  configureOTP();
  //  blacklistCheckOn checking option is enabled
  return processOTP(msisdn, app_id, blacklistCheckOn);
  //  get uuid by phone number
}

module.exports = generateTOtp;
