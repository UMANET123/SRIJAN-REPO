const { configureOTP } = require("../helper.model");
const updatePhoneNo = require("../../helpers/mobile-number.modify");
const checkBlackListApp = require("../checkBlackListApp");
const validateOTPSubscriber = require("./_validateOTPSubscriber");
/**
 * Generate TOTP
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {boolean} blacklistChecked App-user blacklist check is required or bypassed condition
 * @returns {Promise}  Response JSON
 */
module.exports = function(msisdn, app_id, blacklistChecked) {
  msisdn = updatePhoneNo(msisdn);
  //  update otp settings
  configureOTP();
  //  blacklistCheckOn checking option is enabled
  // return processOTP(msisdn, app_id, blacklistCheckOn);
  return new Promise(async (resolve, reject) => {
    if (blacklistChecked) {
      //  need to check app-user is blackListed
      try {
        //  app-user is blacklisted in boolean
        let isBlackListed = await checkBlackListApp(msisdn, app_id);
        // * isBlackListed === true
        if (isBlackListed) {
          // Forbid Request
          return resolve({
            status: 403,
            body: {
              error_code: "Forbidden",
              error_message: "App is blacklisted"
            }
          });
        } else {
          //  Process generate OTP Flow
          return resolve(validateOTPSubscriber(msisdn, app_id));
        }
      } catch (err) {
        return reject(err);
      }
    } else {
      //  bypass blacklist app-user check
      //  Process generate OTP Flow

      return resolve(validateOTPSubscriber(msisdn, app_id));
    }
  });
  //  get uuid by phone number
};
