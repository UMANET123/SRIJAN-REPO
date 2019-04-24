const { getNewSecret, getNewOtp } = require("../helper.model");
const { getOtpMsgTemplate } = require("./_util");
const sendOtpSms = require("./_sendOTPSMS");
const addMinToDate = require("../../helpers/add-minute-to-date");
const { SubscriberDataMask, SubscriberOTP } = require("../../config/models");
const { OTP_EXPIRY_TIME } = require("./_constants");

/**
 * Insert OTP into subscriber_otps and subscriber_mask table
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @returns {Promise} Response Object
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
        await findOrCreateMask(uuid, msisdn, 0);
        // uuid, app_id, otp, currentDate, status, resend_count
        await createOTPRecord(uuid, app_id, otp, currentDate, 0, 1);
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
          status: 503
        });
      }
    } catch (err) {
      return reject(err);
    }
  });
};

/**
 *
 * Create a Record for Subscriber Mask
 * @param {string} uuid Subscriber Id
 * @param {string} phone_no Mobile Number
 * @param {number} status 0 /1  number
 * @returns {Promise}
 */
function findOrCreateMask(uuid, phone_no, status) {
  return SubscriberDataMask.findOrCreate({
    where: { uuid, phone_no, status },
    attributes: ["uuid"]
  });
}

/**
 *
 * create Subscriber OTP record entry
 * @param {string} uuid Subscriber Id
 * @param {string} app_id App Id
 * @param {string} otp OTP 6 digit number in a string
 * @param {Date} currentDate Current date/ TimeStamp
 * @param {number} [status=0] record Status default 0 == valid, 1 == invalid
 * @param {number} [resend_count=1] Resend OTP count default 1
 * @returns {Promise}
 */
function createOTPRecord(
  uuid,
  app_id,
  otp,
  currentDate,
  status = 0,
  resend_count = 1
) {
  return SubscriberOTP.create({
    uuid,
    app_id,
    otp,
    expiration: addMinToDate(currentDate, OTP_EXPIRY_TIME),
    status,
    resend_at: currentDate,
    resend_count
  });
}
