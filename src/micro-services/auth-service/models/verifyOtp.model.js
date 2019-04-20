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
 * @param {function} callback returns message and status code
 * @returns {function} returns message and status code
 */
module.exports = (subscriber_id, otp, app_id) => {
  return new Promise(async (resolve, reject) => {
    //  User Flood Control check

    try {
      let isUserBlocked = await isUserFlooded(subscriber_id);
      if (isUserBlocked) {
        console.log("**** ACCOUNT BLOCKED ****");
        return resolve({
          body: {
            error_code: "Unauthorized",
            error_message: "Account Blocked, please try in 30 mins"
          },
          status: 403
        });
      } else {
        // find OTP
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
            //  reset OTP record resend Count
            await SubscriberOTP.update(
              {
                resend_count: 0
              },
              { where: { uuid: subscriber_id, app_id } }
            );
            return resolve({ body: null, status: 200 });
          } else {
            // NO valid Record exists
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
             * Invalidate OTP here
             */
            await FloodControl.update(
              { status: 1 },
              { where: { uuid: subscriber_id } }
            );
            await invalidateOTP(subscriber_id, app_id);
            return resolve({
              body: {
                error_code: "Unauthorized",
                error_message: "Account Blocked, please try in 30 mins"
              },
              status: 403
            });
          } else {
            console.log("**** INVALID OTP ****");
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

  // return isUserFlooded(subscriber_id, isBlocked => {
  //   if (isBlocked) {
  //     console.log("**** ACCOUNT BLOCKED ****");
  //     return callback(
  //       {
  //         error_code: "Unauthorized",
  //         error_message: "Account Blocked, please try in 30 mins"
  //       },
  //       403
  //     );
  //   } else {
  //     // find OTP
  //     return SubscriberOTP.findOne({
  //       where: {
  //         otp: otp,
  //         uuid: subscriber_id,
  //         app_id: app_id,
  //         expiration: {
  //           [Op.gt]: new Date()
  //         }
  //       },
  //       attributes: [
  //         "uuid",
  //         "app_id",
  //         "developer_id",
  //         "otp",
  //         "expiration",
  //         "status"
  //       ],
  //       raw: true
  //     })
  //       .then(result => {
  //         if (result) {
  //           if (result.status == 0) {
  //             // Delete the flood control
  //             // Create a transaction and send

  //             return FloodControl.destroy({
  //               where: { uuid: subscriber_id }
  //             })
  //               .then(() => {
  //                 return invalidateOTP(subscriber_id, app_id, () => {
  //                   return SubscriberOTP.update(
  //                     {
  //                       resend_count: 0
  //                     },
  //                     { where: { uuid: subscriber_id, app_id } }
  //                   )
  //                     .then(() =>
  //                       //  return OTP response with callback
  //                       {
  //                         return callback(null, 200);
  //                       }
  //                     )
  //                     .catch(err => console.log(err));
  //                 });
  //               })
  //               .catch(e =>
  //                 callback(
  //                   {
  //                     error_code: "InternalServerError",
  //                     error_message: "Internal Server Error"
  //                   },
  //                   500
  //                 )
  //               );
  //           } else {
  //             console.log("**** INVALID OTP ****");
  //             return callback(
  //               {
  //                 error_code: "InvalidOTP",
  //                 error_message: "OTP Invalid, Please Generate a new one"
  //               },
  //               400
  //             );
  //           }
  //         } else {
  //           // Update FloodControl to incrememnt retry
  //           // If Retry is > 3 block account
  //           FloodControl.increment("retry", {
  //             where: { uuid: subscriber_id }
  //           }).then(() => {
  //             return FloodControl.findOne({
  //               where: {
  //                 uuid: subscriber_id
  //               },
  //               attributes: ["retry", "created_at"],
  //               raw: true
  //             })
  //               .then(floodControl => {
  //                 console.table(floodControl);
  //                 if (floodControl.retry >= 3) {
  //                   /**
  //                    * Invalidate OTP here
  //                    */
  //                   return FloodControl.update(
  //                     { status: 1 },
  //                     { where: { uuid: subscriber_id } }
  //                   )
  //                     .then(() => {
  //                       return invalidateOTP(subscriber_id, app_id, () => {
  //                         console.log("**** ACCOUNT BLOCKED ****");
  //                         return callback(
  //                           {
  //                             error_code: "Unauthorized",
  //                             error_message:
  //                               "Account Blocked, please try in 30 mins"
  //                           },
  //                           403
  //                         );
  //                       });
  //                     })
  //                     .catch(e =>
  //                       callback(
  //                         {
  //                           error_code: "InternalServerError",
  //                           error_message: "Internal Server Error"
  //                         },
  //                         500
  //                       )
  //                     );
  //                 } else {
  //                   console.log("**** INVALID OTP ****");
  //                   return callback(
  //                     {
  //                       error_code: "Unauthorized",
  //                       error_message: "OTP Verification Failed"
  //                     },
  //                     403
  //                   );
  //                 }
  //               })
  //               .catch(e =>
  //                 callback(
  //                   {
  //                     error_code: "InternalServerError",
  //                     error_message: "Internal Server Error"
  //                   },
  //                   500
  //                 )
  //               );
  //           });
  //         }
  //       })
  //       .catch(e =>
  //         callback(
  //           {
  //             error_code: "InternalServerError",
  //             error_message: "Internal Server Error"
  //           },
  //           500
  //         )
  //       );
  //   }
  // });
};

/**
 * Invalidated an OTP after it has been verified/blocked
 * @param {string} subscriber_id Subscriber ID
 * @param {string} app_id App ID
 * @returns {function} returns a boolean value as a function argument
 */
function invalidateOTP(subscriber_id, app_id) {
  return new Promise(async (resolve, reject) => {
    try {
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
