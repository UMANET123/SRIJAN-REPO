/*jshint esversion: 8 */
require("dotenv").config();
/**
 * MAJOR TODO
 * - Write test cases for each and every case
 * - Write error handlers for every possible condition
 */
const {
  FloodControl,
  SubscriberDataMask,
  SubscriberOTP,
  Op
} = require("../config/models");
const addMinToDate = require("../helpers/add-minute-to-date");
const { createTransaction } = require("./_transaction.util");
const {
  configureOTP,
  getNewOtp,
  getNewSecret,
  checkBlackListApp
} = require("./helper.model");
const { verifyUser } = require("./auth.model");
const updatePhoneNo = require("../helpers/mobile-number.modify");
const request = require("request-promise");
/**
 * Constants
 */

//  User Block limit in mins
const BLOCK_USER_LIMIT = 1;
//  OTP exipiry time in mins
const OTP_EXPIRY_TIME = 5;
//
var i = 0;
/**
 * Generate TOTP
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {boolean} blacklist Blacklist condition
 * @param {function} callback Callback on return
 * @returns {function} Call back with message and status
 */
function generateTOtp(msisdn, app_id, blacklist, callback) {
  msisdn = updatePhoneNo(msisdn);
  //  update otp settings
  configureOTP();
  //  blacklist checking option is enabled
  if (blacklist) {
    checkBlackListApp(msisdn, app_id, isBlackListed => {
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
        return alwaysCreateOTP(msisdn, app_id, callback);
      }
    });
  } else {
    //  generate OTP when blacklist check = false
    return alwaysCreateOTP(msisdn, app_id, callback);
  }
  //  get uuid by phone number
}

/**
 * Generate OTP based on verification of user and adding data to flood control ( retry logic )
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {function} callback  Callback Function
 * @returns(function) callback Callback Function
 */
function alwaysCreateOTP(msisdn, app_id, callback) {
  return verifyUser(msisdn, null, response => {
    if (response && response.subscriber_id) {
      //   user exists
      let uuid = response.subscriber_id;

      //  check flood control
      return processFloodControl(uuid, isBlocked => {
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
          //  user not blocked
          //  check any record exists with same app_id, uuid
          return SubscriberOTP.findOne({
            where: { uuid, app_id },
            attributes: ["otp"],
            status: 0
          }).then(oldOtp => {
            if (oldOtp && oldOtp.otp) {
              //  previously OTP exists
              let newOtp = getNewOtp(uuid);
              //  get sms template
              let smsContent = getOtpMsgTemplate(newOtp);
              //  Send OTP SMS
              //  After successful SMS send Do transaction
              sendOtpSms(smsContent, msisdn, isSent => {
                //  check for network error
                if (isSent == 500) {
                  return callback(
                    {
                      error_code: "InternalServerError",
                      error_message: "Internal Server Error"
                    },
                    500
                  );
                }
                //  sms sending true
                if (isSent) {
                  //  update with new OTP
                  return SubscriberOTP.update(
                    {
                      otp: newOtp,
                      expiration: addMinToDate(new Date(), OTP_EXPIRY_TIME),
                      status: 0
                    },
                    { where: { uuid, app_id } }
                  )
                    .then(() =>
                      //  return OTP response with callback
                      {
                        return callback(
                          {
                            subscriber_id: uuid,
                            otp: newOtp,
                            app_id: app_id
                          },
                          201
                        );
                      }
                    )
                    .catch(err => console.log(err));
                } else {
                  return callback(
                    { status: `Sorry, unable to send otp to ${msisdn}` },
                    400
                  );
                }
              });
            } else {
              //  No record exists with requested uuid, app_id
              //  create new OTP record
              return insertOtpRecord(msisdn, app_id, (response, status) => {
                return callback(response, status);
              });
            }
          });
        }
      });
      //  create new OTP
      //  update OTP
    } else {
      //  No record exists with requested uuid, app_id
      //  create new OTP record
      return insertOtpRecord(msisdn, app_id, (response, status) => {
        return callback(response, status);
      });
      //  insert the user
    }
  });
}

/**
 * Flood Control Processor
 * @param {string} uuid Subscriber ID
 * @param {function} callback Callback Function
 * @returns {funciton} callback
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
        //  flood control record is blocked === 1 check
        if (floodControl.status === parseInt(1)) {
          //  check time validity
          let difference = floodControlTimeValidity(
            new Date(floodControl.created_at),
            new Date()
          );
          //  check time difference with block limit time
          if (difference >= BLOCK_USER_LIMIT) {
            // unblock it / reset the record
            //  delete the record
            return FloodControl.destroy({
              where: {
                uuid
              }
            })
              .then(() =>
                //  create a record for the user
                FloodControl.create({
                  uuid
                })
                  .then(() => callback(false))
                  .catch(e => console.log(e))
              )
              .catch(e => console.log(e));
          } else {
            //  block it isBlocked === true
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
 * Returns difference between two datetime inputs
 * @param {Date} createdDate Create_At (Date/Time)
 * @param {Date} currentDate Now (Date/Time)
 * @returns {number} difference between the two datetimes
 */
function floodControlTimeValidity(createdDate, currentDate) {
  return Math.round((currentDate - createdDate) / 1000 / 60);
}

/**
 * Insert OTP into subscriber_otps and subscriber_mask table
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {function} callback Function Callback
 * @returns {callback} returns created record along with status
 */
function insertOtpRecord(msisdn, app_id, callback) {
  //  insert flood control record
  //  New User
  //  get new Secret
  let uuid = getNewSecret(msisdn);
  //  get new otp for new record
  let otp = getNewOtp(uuid);
  let smsContent = getOtpMsgTemplate(otp);

  //  send sms
  sendOtpSms(smsContent, msisdn, isSent => {
    if (isSent == 500) {
      return callback(
        {
          error_code: "InternalServerError",
          error_message: "Internal Server Error"
        },
        500
      );
    }
    //  otp sending successful
    if (isSent) {
      //  Send OTP SMS
      //  After successful SMS send Do transaction
      //  insert records to the table
      let currentDate = new Date();
      //  query to find the user
      //  insert record to subscriber data mask
      return SubscriberDataMask.findOrCreate({
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
    } else {
      return callback(
        { status: `Sorry, unable to send otp to ${msisdn}` },
        400
      );
    }
  });
}
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
               * Invalidate OTP here
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

/**
 * Invalidated an OTP after it has been verified/blocked
 * @param {string} subscriber_id Subscriber ID
 * @param {string} app_id App ID
 * @param {function} callback returns a boolean value
 * @returns {function} returns a boolean value as a function argument
 */
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
/**
 *
 *
 * @param {string} message OTP sms
 * @param {string} address mobile number
 * @returns {function} Callback function with argument as boolean
 *
 * Send Otp to address/mobile number and return boolean/500
 * as per the response
 */
function sendOtpSms(message, address, callback) {
  //  find sms service status from enviroment
  let smsIsActive = process.env.SMS_SERVICE_ACTIVE == "true";
  //  check SMS service is not active
  //  then skip sms api call
  if (!smsIsActive) return callback(true);
  //  else proceed
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
  request(options)
    .then(smsResponse => {
      let {
        outboundSMSMessageRequest: { address }
      } = JSON.parse(smsResponse);
      if (address) return callback(true);
      return callback(false);
    })
    .catch(() => {
      return callback(500);
    });
}
/**
 *
 *
 * @param {number} otp OTP number
 * @returns {string} OTP messsage Template
 */
function getOtpMsgTemplate(otp) {
  return `${otp} is your One Time Password for Globe login.This OTP is usable only once and valid for 5 minutes from the request`;
}

module.exports = { generateTOtp, verifyTOtp };
