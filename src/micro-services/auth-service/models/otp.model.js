/*jshint esversion: 8 */
require("dotenv").config();
/**
 * MAJOR TODO
 * - Write test cases for each and every case
 * - Write error handlers for every possible condition
 */
const { FloodControl, SubscriberOTP, Op } = require("../config/models");
// const addMinToDate = require("../helpers/add-minute-to-date");
// const {
//   getNewOtp,
//   getNewSecret,
//   checkBlackListApp
// } = require("./helper.model");
// const { verifyUser } = require("./auth.model");

// const {
//   BLOCK_USER_LIMIT,
//   OTP_EXPIRY_TIME
// } = require("./generateTOtp/_constants");

/**
 * Generate OTP based on verification of user and adding data to flood control ( retry logic )
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {function} callback  Callback Function
 * @returns(function) callback Callback Function
 */

/**
 * Flood Control Processor
 * @param {string} uuid Subscriber ID
 * @param {function} callback Callback Function
 * @returns {funciton} callback returns boolean and null if internal server error
 */

/**
 * Returns difference between two datetime inputs
 * @param {Date} createdDate Create_At (Date/Time)
 * @param {Date} currentDate Now (Date/Time)
 * @returns {number} difference between the two datetimes
 */

//  verify OTP
/**
 * Verify supplied OTP
 * @param {string} subscriber_id Subscriber ID or UUID
 * @param {string} otp 6 digit OTP number
 * @param {string} app_id App ID
 * @param {function} callback returns message and status code
 * @returns {function} returns message and status code
 */
function verifyTOtp(subscriber_id, otp, app_id, callback) {
  isUserFlooded(subscriber_id, isBlocked => {
    if (isBlocked && typeof isBlocked == "boolean") {
      console.log("**** ACCOUNT BLOCKED ****");
      return callback(
        {
          error_code: "Unauthorized",
          error_message: "Account Blocked, please try in 30 mins"
        },
        403
      );
    } else if (!isBlocked && typeof isBlocked == "boolean") {
      // find OTP
      return SubscriberOTP.findOne({
        where: {
          otp: otp,
          uuid: subscriber_id,
          app_id: app_id,
          expiration: {
            [Op.gt]: new Date()
          }
        },
        attributes: [
          "uuid",
          "app_id",
          "developer_id",
          "otp",
          "expiration",
          "status"
        ],
        raw: true
      })
        .then(result => {
          if (result) {
            if (result.status == 0) {
              // Delete the flood control
              // Create a transaction and send

              return FloodControl.destroy({
                where: { uuid: subscriber_id }
              })
                .then(() => {
                  return invalidateOTP(subscriber_id, app_id, () => {
                    return SubscriberOTP.update(
                      {
                        resend_count: 0
                      },
                      { where: { uuid: subscriber_id, app_id } }
                    )
                      .then(() =>
                        //  return OTP response with callback
                        {
                          return callback(null, 200);
                        }
                      )
                      .catch(err => console.log(err));
                  });
                })
                .catch(e =>
                  callback(
                    {
                      error_code: "InternalServerError",
                      error_message: "Internal Server Error"
                    },
                    500
                  )
                );
            } else {
              console.log("**** INVALID OTP ****");
              return callback(
                {
                  error_code: "InvalidOTP",
                  error_message: "OTP Invalid, Please Generate a new one"
                },
                400
              );
            }
          } else {
            // Update FloodControl to incrememnt retry
            // If Retry is > 3 block account
            FloodControl.increment("retry", {
              where: { uuid: subscriber_id }
            }).then(() => {
              return FloodControl.findOne({
                where: {
                  uuid: subscriber_id
                },
                attributes: ["retry", "created_at"],
                raw: true
              })
                .then(floodControl => {
                  console.table(floodControl);
                  if (floodControl.retry >= 3) {
                    /**
                     * Invalidate OTP here
                     */
                    return FloodControl.update(
                      { status: 1 },
                      { where: { uuid: subscriber_id } }
                    )
                      .then(() => {
                        return invalidateOTP(subscriber_id, app_id, () => {
                          console.log("**** ACCOUNT BLOCKED ****");
                          return callback(
                            {
                              error_code: "Unauthorized",
                              error_message:
                                "Account Blocked, please try in 30 mins"
                            },
                            403
                          );
                        });
                      })
                      .catch(e =>
                        callback(
                          {
                            error_code: "InternalServerError",
                            error_message: "Internal Server Error"
                          },
                          500
                        )
                      );
                  } else {
                    console.log("**** INVALID OTP ****");
                    return callback(
                      {
                        error_code: "Unauthorized",
                        error_message: "OTP Verification Failed"
                      },
                      403
                    );
                  }
                })
                .catch(e =>
                  callback(
                    {
                      error_code: "InternalServerError",
                      error_message: "Internal Server Error"
                    },
                    500
                  )
                );
            });
          }
        })
        .catch(e =>
          callback(
            {
              error_code: "InternalServerError",
              error_message: "Internal Server Error"
            },
            500
          )
        );
    } else {
      return callback(
        {
          error_code: "InternalServerError",
          error_message: "Internal Server Error"
        },
        500
      );
    }
  });
}

/**
 * Invalidated an OTP after it has been verified/blocked
 * @param {string} subscriber_id Subscriber ID
 * @param {string} app_id App ID
 * @param {function} callback returns a boolean value
 * @returns {function} returns a boolean value as a function argument
 */
function invalidateOTP(subscriber_id, app_id, callback) {
  return SubscriberOTP.update(
    { status: 1 },
    {
      where: {
        uuid: subscriber_id,
        app_id: app_id,
        status: 0
      }
    }
  )
    .then(() => {
      return callback(true);
    })
    .catch(e =>
      callback(
        {
          error_code: "InternalServerError",
          error_message: "Internal Server Error"
        },
        500
      )
    );
}
/**
 *
 *
 * @param {number} otp OTP number
 * @returns {string} OTP messsage Template
 */

module.exports = { verifyTOtp };
