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
const BLOCK_USER_LIMIT = 30;
//  OTP exipiry time in mins
const OTP_EXPIRY_TIME = 5;
/**
 * Generate TOTP
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {boolean} blacklist Blacklist condition
 * @param {function} resolve Callback on return
 * @returns {function} Call back with message and status
 */
function generateTOtp(msisdn, app_id, blacklist) {
  msisdn = updatePhoneNo(msisdn);
  //  update otp settings
  configureOTP();
  //  blacklist checking option is enabled
  if (blacklist) {
    return new Promise((resolve, reject) => {
      checkBlackListApp(msisdn, app_id, isBlackListed => {
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
          return resolve(alwaysCreateOTP(msisdn, app_id));
        }
      });
    });
  } else {
    //  generate OTP when blacklist check = false
    return resolve(alwaysCreateOTP(msisdn, app_id));
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
function alwaysCreateOTP(msisdn, app_id) {
  return new Promise((resolve, reject) => {
    return verifyUser(msisdn, null, response => {
      if (response && response.subscriber_id) {
        //   user exists
        let uuid = response.subscriber_id;

        //  check flood control
        return processFloodControl(uuid, isBlocked => {
          // user is blocked
          console.log("**** IS BLOCKED: ", isBlocked);
          if (isBlocked && typeof isBlocked == "boolean") {
            return resolve({
              status: 403,
              body: {
                error_code: "Unauthorized",
                error_message: "Account Blocked, please try in 30 mins"
              }
            });
          } else if (!isBlocked && typeof isBlocked == "boolean") {
            //  user not blocked
            //  check any record exists with same app_id, uuid
            return SubscriberOTP.findOne({
              where: { uuid, app_id },
              attributes: ["otp", "resend_at", "resend_count"],
              status: 0
            }).then(async oldOtp => {
              if (oldOtp && oldOtp.otp) {
                //  previously OTP exists
                let difference = floodControlTimeValidity(
                  new Date(oldOtp.resend_at),
                  new Date()
                );
                console.log("-- DIFFERENCE : ", difference);
                console.log(
                  "-- DIFFERENCE VALID:",
                  difference >= BLOCK_USER_LIMIT
                );
                let newOtp = getNewOtp(uuid);
                //  get sms template
                let smsContent = getOtpMsgTemplate(newOtp);
                if (difference < BLOCK_USER_LIMIT && oldOtp.resend_count >= 3) {
                  console.log(
                    "**** WITHIN BLOCK TIME AND MORE THAN 3 TIMES ****"
                  );
                  return resolve({
                    body: {
                      error_code: "Unauthorized",
                      error_message: "Account Blocked, please try in 30 mins"
                    },
                    status: 403
                  });
                } else if (
                  difference < BLOCK_USER_LIMIT &&
                  oldOtp.resend_count < 3
                ) {
                  console.log(
                    "**** WITHIN BLOCK TIME AND LESS THAN 3 TIMES ****"
                  );
                  //  Send OTP SMS
                  //  After successful SMS send Do transaction
                  // update OTP table
                  // return Response
                  try {
                    let isSmsSent = await sendOtpSms(smsContent, msisdn);
                    if (isSmsSent) {
                      //  update with new OTP
                      await SubscriberOTP.update(
                        {
                          otp: newOtp,
                          expiration: addMinToDate(new Date(), OTP_EXPIRY_TIME),
                          status: 0,
                          resend_count: oldOtp.resend_count + 1
                        },
                        { where: { uuid, app_id } }
                      );
                      //  return OTP response with callback
                      return resolve({
                        body: {
                          subscriber_id: uuid,
                          otp: newOtp,
                          app_id: app_id
                        },
                        status: 201
                      });
                    } else {
                      return resolve({
                        body: {
                          status: `Sorry, unable to send otp to ${msisdn}`
                        },
                        status: 400
                      });
                    }
                  } catch (err) {
                    console.log(err);
                    // return {
                    //   body: {
                    //     error_code: "InternalServerError",
                    //     error_message: "Internal Server Error"
                    //   },
                    //   status: 500
                    // };
                    return reject("InternalServerError");
                  }
                } else {
                  console.log("**** OUTSIDE BLOCK TIME ****");
                  //  Send OTP SMS
                  //  After successful SMS send Do transaction
                  try {
                    let isSmsSent = await sendOtpSms(smsContent, msisdn);
                    //  sms sending true
                    if (isSmsSent) {
                      //  update with new OTP
                      await SubscriberOTP.update(
                        {
                          otp: newOtp,
                          expiration: addMinToDate(new Date(), OTP_EXPIRY_TIME),
                          status: 0,
                          resend_at: new Date(),
                          resend_count: 1
                        },
                        { where: { uuid, app_id } }
                      );
                      return resolve({
                        body: {
                          subscriber_id: uuid,
                          otp: newOtp,
                          app_id: app_id
                        },
                        status: 201
                      });
                    } else {
                      return resolve({
                        body: {
                          status: `Sorry, unable to send otp to ${msisdn}`
                        },
                        status: 400
                      });
                    }
                  } catch (err) {
                    console.log(err);
                    // return {
                    //   body: {
                    //     error_code: "InternalServerError",
                    //     error_message: "Internal Server Error"
                    //   },
                    //   status: 500
                    // };
                    return reject("InternalServerError");
                  }
                }
              } else {
                //  No record exists with requested uuid, app_id
                //  create new OTP record
                return insertOtpRecord(msisdn, app_id, (body, status) => {
                  return resolve({ body, status });
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
        return insertOtpRecord(msisdn, app_id, (body, status) => {
          return resolve({ body, status });
        });
        //  insert the user
      }
    });
  });
}

/**
 * Flood Control Processor
 * @param {string} uuid Subscriber ID
 * @param {function} callback Callback Function
 * @returns {funciton} callback returns boolean and null if internal server error
 */
function processFloodControl(uuid, callback) {
  //  query to find the user
  console.log("*** UUID : ", uuid);
  FloodControl.findOrCreate({
    where: { uuid: uuid },
    attributes: ["status", "created_at"]
  })
    .spread((floodControl, created) => {
      console.log("*** FLOOD CONTROL CREATED : ", created);
      console.log("*** FLOOD CONTROL DATA : ", floodControl);
      if (!created) {
        //  record already exists
        //  flood control record is blocked === 1 check
        console.log("***** FLOOD CONTROL STATUS : ", floodControl.status);

        if (floodControl.status === parseInt(1)) {
          //  check time validity
          let difference = floodControlTimeValidity(
            new Date(floodControl.created_at),
            new Date()
          );
          //  check time difference with block limit time
          console.log("**** DIFFERENCE : ", difference);
          console.log(
            "**** DIFFERENCE VALID? : ",
            difference >= BLOCK_USER_LIMIT
          );

          if (difference >= BLOCK_USER_LIMIT) {
            console.log("**** I DONT REACH US ****");
            // unblock it / reset the record
            //  delete the record
            return FloodControl.destroy({
              where: {
                uuid
              }
            })
              .then(result =>
                //  create a record for the user
                {
                  console.log("**** DELETE RESULT : ", result);
                  console.log("**** FLOOD CONTROL LIMIT REACHED : ", result);
                  return FloodControl.create({
                    uuid
                  })
                    .then(() => callback(false))
                    .catch(e => console.log(e));
                }
              )
              .catch(e => callback(null));
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
      return callback(null);
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
async function insertOtpRecord(msisdn, app_id, callback) {
  //  insert flood control record
  //  New User
  //  get new Secret
  let uuid = getNewSecret(msisdn);
  //  get new otp for new record
  let otp = getNewOtp(uuid);
  let smsContent = getOtpMsgTemplate(otp);

  //  send sms
  try {
    let isSmsSent = sendOtpSms(smsContent, msisdn);
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
      (async () => {
        try {
          await SubscriberOTP.create({
            uuid,
            app_id,
            otp,
            expiration: addMinToDate(currentDate, OTP_EXPIRY_TIME),
            status: 0,
            resend_at: currentDate,
            resend_count: 1
          });
          return callback(
            {
              subscriber_id: uuid,
              otp,
              app_id
            },
            201
          );
        } catch (err) {
          console.log(err);
          return callback(
            {
              error_code: "InternalServerError",
              error_message: "Internal Server Error"
            },
            500
          );
        }
      })();
    } else {
      // * isSmsSent: false
      return callback(
        { status: `Sorry, unable to send otp to ${msisdn}` },
        400
      );
    }
  } catch (err) {
    console.log(err);
    return callback(
      {
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      },
      500
    );
  }
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
 * @param {string} message OTP sms
 * @param {string} address mobile number
 * @returns {function} Callback function with argument as boolean
 *
 * Send Otp to address/mobile number and return boolean/500
 * as per the response
 */
function sendOtpSms(message, address) {
  //  find sms service status from enviroment
  let smsIsActive = process.env.SMS_SERVICE_ACTIVE == "true";
  //  check SMS service is not active
  //  then skip sms api call
  //  create a promise will return response
  return new Promise((resolve, reject) => {
    // setTimeout(() => resolve("done!"), 1000);
    if (!smsIsActive) return resolve(true);
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
        if (address) return resolve(true);
        return resolve(false);
      })
      .catch(() => reject(new Error("SMS is not Sent!")));
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
