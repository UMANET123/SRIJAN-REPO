/*jshint esversion: 6 */
const { SubscriberDataMask } = require("../config/models");
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
    SubscriberDataMask.findOne({
      where: { phone_no: phone_no },
      attributes: ["uuid"]
    }).then(mask => {
      if (mask && mask.uuid) {
        // success
        callback({ subscriber_id: mask.uuid }, 200);
      } else {
        //  not found
        callback(null, 204);
      }
    });
  } else {
    //  find uuid/subscriber_id by phone number/msisdn
    SubscriberDataMask.findOne({
      where: { uuid },
      attributes: ["phone_no"]
    }).then(mask => {
      if (mask && mask.phone_no) {
        // success
        callback({ msisdn: mask.phone_no }, 200);
      } else {
        //  not found
        callback(null, 204);
      }
    });
  }
}

module.exports = { verifyUser };
