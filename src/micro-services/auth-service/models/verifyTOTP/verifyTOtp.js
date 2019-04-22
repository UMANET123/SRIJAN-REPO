/*jshint esversion: 8 */
const isUserFlooded = require("../generateTOtp/_isUserFlooded");
const {
  findOTPRecord,
  invalidateFloodControl,
  invalidateOTP
} = require("./_util");
const processValidOTP = require("./_processValidOtp");
const invalidOTPHandler = require("./_invalidOtpHandler");
//  verify OTP
/**
 * Verify supplied OTP
 * @param {string} subscriber_id Subscriber ID or UUID
 * @param {string} otp 6 digit OTP number
 * @param {string} app_id App ID
 * @returns {Promise} response Object {status, body} wrapped in Promise
 */
module.exports = (subscriber_id, otp, app_id) => {
  return new Promise(async (resolve, reject) => {
    //  User Flood Control check

    try {
      //  check user is blocked
      let isUserBlocked = await isUserFlooded(subscriber_id);
      if (isUserBlocked) {
        // ("**** ACCOUNT BLOCKED ****");
        return resolve({
          body: {
            error_code: "Unauthorized",
            error_message: "Account Blocked, please try in 30 mins"
          },
          status: 403
        });
      } else {
        // find OTP Record
        let otpRecord = await findOTPRecord(
          otp,
          subscriber_id,
          app_id,
          new Date()
        );
        if (otpRecord) {
          //   OTP record exists
          //  Check OTP record validity
          if (otpRecord.status == 0) {
            //  Valid OTP record exists
            return resolve(processValidOTP(subscriber_id, app_id));
          } else {
            // NO valid Record exists i.e. inactive record == status != 0
            return resolve({
              body: {
                error_code: "InvalidOTP",
                error_message: "OTP Invalid, Please Generate a new one"
              },
              status: 400
            });
          }
        } else {
          //  NO OTP record exists
          //  OTP failure cases
          //  increase retry count
          let retry = await invalidOTPHandler(subscriber_id);
          //  otp verification try >= 3
          if (retry >= 3) {
            await invalidateFloodControl(subscriber_id, 1);
            /**
             * Invalidate OTP Record here
             */
            await invalidateOTP(subscriber_id, app_id);
            //  block user with message
            return resolve({
              body: {
                error_code: "Unauthorized",
                error_message: "Account Blocked, please try in 30 mins"
              },
              status: 403
            });
          } else {
            // "**** INVALID OTP ****"
            //  OTP verification failed
            return resolve({
              body: {
                error_code: "Unauthorized",
                error_message: "OTP Verification Failed"
              },
              status: 403
            });
          }
        }
      }
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};
