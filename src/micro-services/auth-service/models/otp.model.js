/*jshint esversion: 8 */
/**
 * MAJOR TODO
 * - Write test cases for each and every case
 * - Write error handlers for every possible condition
 * - Move towards a pure function approach
 */
const {
  FloodControl,
  SubscriberDataMask,
  SubscriberOTP,
  Op
} = require("../config/models");
const pool = require("../config/db");
const addMinToDate = require("../helpers/add-minute-to-date");
const { createTransaction } = require("./_transaction.util");
const {
  setOtpSettings,
  getNewOtp,
  getNewSecret,
  checkBlackListApp
} = require("./helper.model");
const { verifyUser } = require("./auth.model");
const updatePhoneNo = require("../helpers/mobile-number.modify");

/**
 * Constants
 */

const BLOCK_USER_LIMIT = 1;
const OTP_EXPIRY_TIME = 5;

/**
 *
 * @param {string} msisdn Mobile No
 * @param {string} app_id App ID
 * @param {boolean} blacklist Blacklist Checking Requrement
 * @param {function} callback Callback Function
 * Main Parent Method For Generate OTP route
 *@returns {null}
 */
function generateTOtp(msisdn, app_id, blacklist, callback) {
  msisdn = updatePhoneNo(msisdn);
  //  update otp settings
  setOtpSettings();
  //  blacklist checking option is enabled
  if (blacklist) {
    checkBlackListApp({ msisdn, app_id }, isBlackListed => {
      console.log({ isBlackListed });
      if (isBlackListed) {
        return callback(
          {
            error_code: "Forbidden",
            error_message: "App is blacklisted"
          },
          403
        );
      } else {
        //  generate OTP
        alwaysCreateOTP(msisdn, app_id, callback);
      }
    });
  } else {
    //  generate OTP when blacklist check = false
    alwaysCreateOTP(msisdn, app_id, callback);
  }
  //  get uuid by phone number
}
/**
 *
 * @param {string} msisdn
 * @param {string} app_id
 * @param {function} callback
 * @returns(callback)
 *
 */
function alwaysCreateOTP(msisdn, app_id, callback) {
  verifyUser(msisdn, null, response => {
    if (response && response.subscriber_id) {
      //   user exists
      let uuid = response.subscriber_id;

      //  check flood control
      processFloodControl(uuid, isBlocked => {
        // user is blocked
        if (isBlocked) {
          return callback(
            {
              error_code: "Unauthorized",
              error_message: "Account Blocked, please try in 30 mins"
            },
            403
          );
        } else {
          //  not blocked
          //  check any record exists with same app_id, uuid
          SubscriberOTP.findOne({
            where: { uuid, app_id },
            attributes: ["otp"],
            status: 0
          }).then(oldOtp => {
            if (oldOtp && oldOtp.otp) {
              //  record exists
              let newOtp = getNewOtp(uuid);
              //  update otp records
              SubscriberOTP.update(
                {
                  otp: newOtp,
                  expiration: addMinToDate(new Date(), OTP_EXPIRY_TIME),
                  status: 0
                },
                { where: { uuid, app_id } }
              )
                .then(result =>
                  callback({
                    subscriber_id: uuid,
                    otp: newOtp,
                    app_id: app_id
                  },201)
                )
                .catch(err => console.log(err));
            } else {
              //  create new OTP record
              insertOtpRecord(msisdn, app_id, (response, status) => {
                return callback(response, status);
              });
            }
          });
        }
      });
      //  create new OTP
      //  update OTP
    } else {
      return insertOtpRecord(msisdn, app_id, (response, status) => {
        return callback(response, status);
      });
      //  insert the user
    }
  });
}

//  check Flood Control
/**
 *
 * @param {string} uuid
 * @param {function} callback
 * @returns {funciton} callback with boolean true = not blocked , false = to block user
 */
function processFloodControl(uuid, callback) {
  //  query to find the user
  FloodControl.findOrCreate({
    where: { uuid: uuid },
    attributes: ["status", "created_at"]
  })
    .spread((floodControl, created) => {
      // console.log({ created });
      if (!created) {
        //  record already exists
        //  check time validity
        if (floodControl.status === parseInt(1)) {
          let difference = floodControlTimeValidity(
            new Date(floodControl.created_at),
            new Date()
          );
          // console.log({ difference });
          if (difference >= BLOCK_USER_LIMIT) {
            // unblock it / reset the record
            //  delete the record
            FloodControl.destroy({
              where: {
                uuid
              }
            })
              .then(() =>
                FloodControl.create({
                  uuid
                })
                  .then(() => callback(false))
                  .catch(e => console.log(e))
              )
              .catch(e => console.log(e));
          } else {
            //  block it
            return callback(true);
          }
        }
        return callback(false);
      } else {
        return callback(false);
      }
    })
    .catch(err => {
      console.log(err);
    });
}
/**
 *
 * @param {date} createdDate
 * @param {date} currentDate
 */
function floodControlTimeValidity(createdDate, currentDate) {
  // console.log({ createdDate, currentDate });
  return Math.round((currentDate - createdDate) / 1000 / 60);
}

// insert query transaction for totp for /generate/totp endpoint
/**
 *
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {function} callback Function Callback
 */
function insertOtpRecord(msisdn, app_id, callback) {
  //  insert flood control record
  //  New User
  //  get new Secret
  let uuid = getNewSecret(msisdn);
  //  get new otp for new record
  let otp = getNewOtp(uuid);
  //  insert records to the table
  let currentDate = new Date();
  //  query to find the user
  //  insert record to subscriber data mask
  SubscriberDataMask.findOrCreate({
    where: { uuid, phone_no: msisdn, created: currentDate, status: 0 },
    attributes: ["uuid"]
  }).spread((mask, created) => {
    SubscriberOTP.create({
      uuid,
      app_id,
      otp,
      expiration: addMinToDate(currentDate, OTP_EXPIRY_TIME),
      status: 0
    }).then(otpRecord => {
      return callback(
        {
          subscriber_id: uuid,
          otp,
          app_id
        },
        201
      );
    });
  });
}
//  verify OTP
function verifyTOtp({ subscriber_id, otp, app_id }, callback) {
  processFloodControl(subscriber_id, isBlocked => {
    if (isBlocked) {
      return callback(
        {
          error_code: "Unauthorized",
          error_message: "Account Blocked, please try in 30 mins"
        },
        403
      );
    } else {
      // find OTP
      SubscriberOTP.findOne({
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
      }).then(result => {
        console.log("RESULT : ", result);
        if (result) {
          if (result.status == 0) {
            // Delete the flood control
            // Create a transaction and send

            FloodControl.destroy({ where: { uuid: subscriber_id } }).then(
              () => {
                invalidateOTP(subscriber_id, app_id, () => {
                  createTransaction(
                    null,
                    subscriber_id,
                    app_id,
                    new Date(),
                    0,
                    txnId => {
                      callback({ transaction_id: txnId }, 200);
                    }
                  );
                });
              }
            );
          } else {
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
          FloodControl.increment("retry", { where: { uuid: subscriber_id } });
          FloodControl.findOne({
            where: {
              uuid: subscriber_id
            },
            attributes: ["retry", "created_at"],
            raw: true
          }).then(floodControl => {
            if (floodControl.retry >= 3) {
              /**
               * THERE SEEMS TO BE A PROBLEM HERE
               *  What happens when an account is past 30 mins and passes the same OTP? Shouldn't the OTP be deleted?
               *  This will save a lot of effort passing flow control around
               */
              FloodControl.update(
                { status: 1 },
                { where: { uuid: subscriber_id } }
              ).then(() => {
                invalidateOTP(subscriber_id, app_id, () => {
                  return callback(
                    {
                      error_code: "Unauthorized",
                      error_message: "Account Blocked, please try in 30 mins"
                    },
                    403
                  );
                });
              });
            } else {
              return callback(
                {
                  error_code: "Unauthorized",
                  error_message: "OTP Verification Failed"
                },
                403
              );
            }
          });
        }
      });
    }
  });
}

function invalidateOTP(subscriber_id, app_id, callback) {
  SubscriberOTP.update(
    { status: 1 },
    {
      where: {
        uuid: subscriber_id,
        app_id: app_id,
        status: 0
      }
    }
  ).then(() => {
    return callback(true);
  });
}

//  get user subscriber_id or phone no

module.exports = { generateTOtp, verifyTOtp };
