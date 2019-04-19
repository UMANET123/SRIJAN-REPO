const request = require("request-promise");
/**
 *
 *
 * @param {string} message OTP sms
 * @param {string} address mobile number
 * @returns {Promise} boolean in a Promise Object
 *
 * Send Otp to address/mobile number and return boolean/500
 * as per the response
 */
module.exports = function(message, address) {
  //  find sms service status from enviroment
  let smsIsActive = process.env.SMS_SERVICE_ACTIVE == "true";
  //  check SMS service is not active
  //  then skip sms api call
  let options = {
    method: "POST",
    url: process.env.SMS_API_ENDPOINT,
    headers: {
      "cache-control": "no-cache",
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: {
      message,
      address,
      passphrase: process.env.SMS_PASSPHRASE,
      app_id: process.env.SMS_APP_ID,
      app_secret: process.env.SMS_APP_SECRET
    }
  };
  //  create a promise will return response
  return new Promise(async (resolve, reject) => {
    if (!smsIsActive) return resolve(true);
    try {
      let smsResponse = await request(options);
      let {
        outboundSMSMessageRequest: { address }
      } = JSON.parse(smsResponse);
      if (address) return resolve(true);
      return resolve(false);
    } catch (err) {
      return reject(err);
    }
  });
};
