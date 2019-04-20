/*jshint esversion: 8 */
// require("dotenv").config();
const isUserFlooded = require("./generateTOtp/_isUserFlooded");

const { FloodControl, SubscriberOTP, Op } = require("../config/models");

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
        let otpResponse = await SubscriberOTP.findOne({
          where: {
            otp: otp,
            uuid: subscriber_id,
            app_id: app_id,
            expiration: {
              [Op.gt]: new Date()
            }
          },
          attributes: ["status"],
          raw: true
        });
        if (otpResponse) {
          //   OTP record exists
          //  Check OTP record validity
          if (otpResponse.status == 0) {
            //  Valid OTP record exists
            // Delete the flood control
            await FloodControl.destroy({
              where: { uuid: subscriber_id }
            });
            //  invalidate OTP
            await invalidateOTP(subscriber_id, app_id);
            //  reset OTP record resend Count to 0
            await SubscriberOTP.update(
              {
                resend_count: 0
              },
              { where: { uuid: subscriber_id, app_id } }
            );
            //  return response
            return resolve({ body: null, status: 200 });
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
          let test = await FloodControl.increment("retry", {
            where: { uuid: subscriber_id }
          });
          console.log({ test });
          let { retry } = await FloodControl.findOne({
            where: {
              uuid: subscriber_id
            },
            attributes: ["retry"],
            raw: true
          });
          //  otp verification try >= 3
          if (retry >= 3) {
            /**
             * Invalidate Flood Control Record
             */
            await FloodControl.update(
              { status: 1 },
              { where: { uuid: subscriber_id } }
            );
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

/**
 * Invalidated an OTP after it has been verified/blocked
 * @param {string} subscriber_id Subscriber ID
 * @param {string} app_id App ID
 * @returns {Promise} boolean in Promise Object
 */
function invalidateOTP(subscriber_id, app_id) {
  return new Promise(async (resolve, reject) => {
    try {
      // invalidate OTP record i.e. from update status 0 to 1
      await SubscriberOTP.update(
        { status: 1 },
        {
          where: {
            uuid: subscriber_id,
            app_id: app_id,
            status: 0
          }
        }
      );
      return resolve(true);
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
}
