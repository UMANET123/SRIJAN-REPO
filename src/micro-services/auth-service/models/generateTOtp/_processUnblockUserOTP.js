const { floodControlTimeValidity } = require("./_util");
const { BLOCK_USER_LIMIT } = require("./_constants");
const getUnblockUserOTP = require("./_getUnblockUserOTP");
const insertOtpRecord = require("./_insertOTPRecord");
const { SubscriberOTP } = require("../../config/models");
module.exports = function(uuid, app_id, msisdn) {
  return new Promise(async (resolve, reject) => {
    //  user not blocked
    //  check any record exists with same app_id, uuid
    //  proceed further as account is valid
    //  find account from subscriber OTP table
    // Resend OTP control logic
    try {
      const oldOtp = await SubscriberOTP.findOne({
        where: { uuid, app_id },
        attributes: ["otp", "resend_at", "resend_count"],
        status: 0
      });
      if (oldOtp && oldOtp.otp) {
        //  previously OTP exists
        //  check resend OTP process
        //  find the time difference for Resend OTP
        let difference = floodControlTimeValidity(
          new Date(oldOtp.resend_at),
          new Date()
        );
        console.log("-- DIFFERENCE : ", difference);
        console.log("-- DIFFERENCE VALID:", difference >= BLOCK_USER_LIMIT);

        if (difference < BLOCK_USER_LIMIT) {
          console.log({ old: oldOtp.resend_count });
          if (oldOtp.resend_count >= 3) {
            console.log("**** WITHIN BLOCK TIME AND MORE THAN 3 TIMES ****");
            return resolve({
              body: {
                error_code: "Unauthorized",
                error_message: "Account Blocked, please try in 30 mins"
              },
              status: 403
            });
          } else {
            return resolve(
              getUnblockUserOTP(msisdn, uuid, app_id, oldOtp.resend_count + 1)
            );
          }
        } else {
          // console.log("**** OUTSIDE BLOCK TIME ****");
          return resolve(getUnblockUserOTP(msisdn, uuid, app_id, 1));
        }
      } else {
        //  No record exists with requested uuid, app_id
        //  create new OTP record
        return resolve(insertOtpRecord(msisdn, app_id));
      }
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};
