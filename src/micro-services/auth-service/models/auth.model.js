/*jshint esversion: 6 */
const { SubscriberDataMask } = require("../config/models");
const logger = require("../logger");
const updatePhoneNo = require("../helpers/mobile-number.modify");
/**
 * Returns UUID of a user if exists else null
 * @param {string} phone_no  User msisdn
 * @param {string} uuid  User Subscriber Id
 * @param {function} callback Callback Function
 * @returns {function} (data, statusCode)
 */
function verifyUser(phone_no, uuid, callback) {
  if (phone_no) {
    // update phone number with STD/ISD code
    phone_no = updatePhoneNo(phone_no);
    //  find phone number/msisdn by uuid/subscriber_id
    return SubscriberDataMask.findOne({
      where: { phone_no: phone_no },
      attributes: ["uuid"]
    })
      .then(mask => {
        if (mask && mask.uuid) {
          // success
          return callback({ subscriber_id: mask.uuid }, 200);
        } else {
          //  not found
          logger.log("warn", "AuthModel:SubscriberDataMash.findOne", {
            message: ` Failed for number ${phone_no}`
          });
          return callback(null, 204);
        }
      })
      .catch(e => {
        logger.log("error", "AuthModel:SubscriberDataMash.findOne", {
          message: `Internal Server Error : SubscriberDataMake.findOne`
        });
        return callback(
          {
            error_code: "InternalServerError",
            error_message: "Internal Server Error"
          },
          500
        );
      });
  } else {
    //  find uuid/subscriber_id by phone number/msisdn
    return SubscriberDataMask.findOne({
      where: { uuid },
      attributes: ["phone_no"]
    })
      .then(mask => {
        if (mask && mask.phone_no) {
          // success
          return callback({ msisdn: mask.phone_no }, 200);
        } else {
          //  not found
          logger.log("warn", "AuthModel:SubscriberDataMask.findOne", {
            message: `no user found with uuid ${uuid}`
          });
          return callback(null, 204);
        }
      })
      .catch(e => {
        logger.log("error", "AuthModel:SubscriberDataMask.findOne", {
          message: `Internal Server Error`
        });
        return callback(
          {
            error_code: "InternalServerError",
            error_message: "Internal Server Error"
          },
          500
        );
      });
  }
}

module.exports = { verifyUser };
