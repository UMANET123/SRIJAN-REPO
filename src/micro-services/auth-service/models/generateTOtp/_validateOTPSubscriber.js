const { verifyUser } = require("../auth.model");
const isUserFlooded = require("./_isUserFlooded");
const resendOtpHandler = require("./_resendOTPHandler");
const insertOtpRecord = require("./_insertOTPRecord");
module.exports = function(msisdn, app_id) {
  return new Promise((resolve, reject) => {
    return verifyUser(msisdn, null, async response => {
      if (response && response.subscriber_id) {
        //   user exists
        let uuid = response.subscriber_id;

        //  check flood control
        try {
          const isBlocked = await isUserFlooded(uuid);
          console.log("**** IS BLOCKED: ", isBlocked);
          if (isBlocked) {
            return resolve({
              status: 403,
              body: {
                error_code: "Unauthorized",
                error_message: "Account Blocked, please try in 30 mins"
              }
            });
          } else {
            //  App-user is not blocked
            return resolve(resendOtpHandler(uuid, app_id, msisdn));
          }
        } catch (err) {
          console.log(err);
          return reject(err);
        }
      } else {
        // * No record exists with requested uuid, app_id
        // * create new OTP record
        return resolve(insertOtpRecord(msisdn, app_id));
        //  insert the user
      }
    });
  });
};
