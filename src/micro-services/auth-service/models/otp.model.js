/*jshint esversion: 8 */
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

/**
 * Constants
 */

//  User Block limit in mins
const BLOCK_USER_LIMIT = 30;
//  OTP exipiry time in mins
const OTP_EXPIRY_TIME = 5;
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
        console.log("**** IS BLOCKED: ", isBlocked);
        if (isBlocked && typeof isBlocked == "boolean") {
          return callback(
            {
              error_code: "Unauthorized",
              error_message: "Account Blocked, please try in 30 mins"
            },
            403
          );
        } else if (!isBlocked && typeof isBlocked == "boolean") {
          //  user not blocked
          //  check any record exists with same app_id, uuid
          return SubscriberOTP.findOne({
            where: { uuid, app_id },
            attributes: ["otp"],
            status: 0
          })
            .then(oldOtp => {
              if (oldOtp && oldOtp.otp) {
                //  previously OTP exists
                let newOtp = getNewOtp(uuid);
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
                  .catch(err =>
                    callback(
                      {
                        error_code: "InternalServerError",
                        error_message: "Internal Server Error"
                      },
                      500
                    )
                  );
              } else {
                //  No record exists with requested uuid, app_id
                //  create new OTP record
                return insertOtpRecord(msisdn, app_id, (response, status) => {
                  return callback(response, status);
                });
              }
            })
            .catch(error => {
              return callback(
                {
                  error_code: "InternalServerError",
                  error_message: "Internal Server Error"
                },
                500
              );
            });
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
        console.log('***** FLOOD CONTROL STATUS : ', floodControl.status);

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
    })
      .then(otpRecord => {
        return callback(
          {
            subscriber_id: uuid,
            otp,
            app_id
          },
          201
        );
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
                    return createTransaction(
                      null,
                      subscriber_id,
                      app_id,
                      new Date(),
                      0,
                      txnId => {
                        return callback({ transaction_id: txnId }, 200);
                      }
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

module.exports = { generateTOtp, verifyTOtp };
