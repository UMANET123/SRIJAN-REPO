const { getNewSecret, getNewOtp } = require("../helper.model");
const { getOtpMsgTemplate } = require("./_util");
const sendOtpSms = require("./_sendOTPSms");
const addMinToDate = require("../../helpers/add-minute-to-date");
const { SubscriberDataMask, SubscriberOTP } = require("../../config/models");
const { OTP_EXPIRY_TIME } = require("./_constants");

/**
 * Insert OTP into subscriber_otps and subscriber_mask table
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {function} callback Function Callback
 * @returns {callback} returns created record along with status
 */
module.exports = function(msisdn, app_id) {
  //  insert flood control record
  //  New User
  //  get new Secret
  let uuid = getNewSecret(msisdn);
  //  get new otp for new record
  let otp = getNewOtp(uuid);
  let smsContent = getOtpMsgTemplate(otp);
  return new Promise(async (resolve, reject) => {
    //  send sms
    try {
      let isSmsSent = await sendOtpSms(smsContent, msisdn);
      if (isSmsSent) {
        // * isSmsSent: true
        //  Send OTP SMS
        //  After successful SMS send Do transaction
        //  insert records to the table
        let currentDate = new Date();
        //  query to find the user
        //  insert record to subscriber data mask
        await SubscriberDataMask.findOrCreate({
          where: { uuid, phone_no: msisdn, status: 0 },
          attributes: ["uuid"]
        });
        await SubscriberOTP.create({
          uuid,
          app_id,
          otp,
          expiration: addMinToDate(currentDate, OTP_EXPIRY_TIME),
          status: 0,
          resend_at: currentDate,
          resend_count: 1
        });
        return resolve({
          body: {
            subscriber_id: uuid,
            otp,
            app_id
          },
          status: 201
        });
      } else {
        // * isSmsSent: false
        return resolve({
          body: `Sorry, unable to send otp to ${msisdn}`,
          status: 417
        });
      }
    } catch (err) {
      return reject(err);
    }
  });
};
