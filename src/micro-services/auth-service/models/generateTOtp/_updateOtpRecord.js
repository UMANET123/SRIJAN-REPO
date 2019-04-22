const { getNewOtp } = require("../helper.model");
const { getOtpMsgTemplate } = require("./_util");
const addMinToDate = require("../../helpers/add-minute-to-date");
const { SubscriberOTP } = require("../../config/models");
const sendOtpSms = require("./_sendOTPSms");
const { OTP_EXPIRY_TIME } = require("./_constants");
/**
 *
 * update Subscriber OTP record and return JSON response
 * @param {string} msisdn Mobile Number
 * @param {string} uuid Subscriber Id
 * @param {string} app_id App id
 * @param {number} resend_count Number of OTP resend / try request
 * @returns {Promise} Response Object in a Promise
 */
module.exports = function(msisdn, uuid, app_id, resend_count) {
  //   console.log({ msisdn, uuid, app_id, resend_count });
  //  get sms template

  let otp = getNewOtp(uuid);
  let smsContent = getOtpMsgTemplate(otp);
  return new Promise(async (resolve, reject) => {
    console.log("**** WITHIN BLOCK TIME AND LESS THAN 3 TIMES ****");
    //  ==== Send OTP SMS
    //  After successful SMS send Do transaction
    // update OTP table
    // return Response
    try {
      let isSmsSent = await sendOtpSms(smsContent, msisdn);
      // console.log({ isSmsSent });
      if (isSmsSent) {
        //  update with new OTP
        try {
          await SubscriberOTP.update(
            {
              otp,
              expiration: addMinToDate(new Date(), OTP_EXPIRY_TIME),
              status: 0,
              resend_count
            },
            { where: { uuid, app_id } }
          );
          //  return OTP response with callback
          return resolve({
            body: {
              subscriber_id: uuid,
              otp,
              app_id
            },
            status: 201
          });
        } catch (err) {
          console.log(err);
          return reject(err);
        }
      } else {
        return resolve({
          body: `Sorry, unable to send otp to ${msisdn}`,
          status: 503
        });
      }
    } catch (err) {
      console.log(err);
      return reject(err);
    }
  });
};
