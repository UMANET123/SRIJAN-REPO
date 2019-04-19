const checkBlackListApp = require("../checkBlackListApp");
const validateOTPSubscriber = require("./_validateOTPSubscriber");
module.exports = function(msisdn, app_id, blacklistCheckOn) {
  return new Promise(async (resolve, reject) => {
    if (blacklistCheckOn) {
      try {
        let isBlackListed = await checkBlackListApp(msisdn, app_id);
        if (isBlackListed) {
          return resolve({
            status: 403,
            body: {
              error_code: "Forbidden",
              error_message: "App is blacklisted"
            }
          });
        } else {
          //  generate OTP
          return resolve(validateOTPSubscriber(msisdn, app_id));
        }
      } catch (err) {
        return reject(err);
      }
    } else {
      //  generate OTP when blacklist check = false

      return resolve(validateOTPSubscriber(msisdn, app_id));
    }
  });
};
