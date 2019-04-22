/*jshint esversion: 8 */
const { FloodControl, SubscriberOTP, Op } = require("../../config/models");
/**
 * Invalidated an OTP after it has been verified/blocked
 * @param {string} subscriber_id Subscriber ID
 * @param {string} app_id App ID
 * @returns {Promise} boolean in Promise Object
 */
function invalidateOTP(subscriber_id, app_id) {
  return new Promise(async (resolve, reject) => {
    try {
      // invalidate OTP record i.e. from update status 0 to 1
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

/**
 *
 * Find OTP record
 * @param {string} otp OTP
 * @param {string} subscriber_id Subscriber Id
 * @param {string} app_id App Id
 * @param {Date} date Date to compare with Expiration
 * @returns {Promise} Object
 */
function findOTPRecord(otp, subscriber_id, app_id, date) {
  return SubscriberOTP.findOne({
    where: {
      otp: otp,
      uuid: subscriber_id,
      app_id: app_id,
      expiration: {
        [Op.gt]: date
      }
    },
    attributes: ["status"],
    raw: true
  });
}

/**
 *
 *
 * @param {string} subscriber_id Subscriber ID
 * @param {number} [status=1] Status default value 1 to invalidate
 * @returns {Promise}
 */
function invalidateFloodControl(subscriber_id, status = 1) {
  /**
   * Invalidate Flood Control Record
   */
  return FloodControl.update({ status }, { where: { uuid: subscriber_id } });
}

/**
 *
 * delete flood control record by subscriber id
 * @param {string} uuid Subscriber Id
 * @returns {Promise}
 */
function deleteFloodControl(uuid) {
  return FloodControl.destroy({
    where: { uuid }
  });
}
/**
 * Reset/Update Resend Count to 0
 * @param {string} uuid Subscriber Id
 * @param {string} app_id App Id
 * @param {number} [resend_count=0] Number of Resend OTP Hit
 * @returns {Promise}
 */
function resetResendOTPCount(uuid, app_id, resend_count = 0) {
  return SubscriberOTP.update(
    {
      resend_count
    },
    { where: { uuid, app_id } }
  );
}

/**
 *
 * increment Flood Control  Retry
 * @param {string} uuid Subscriber ID
 * @returns {Promise}
 */
function incrementFloodControlRetry(uuid) {
  return FloodControl.increment("retry", {
    where: { uuid }
  });
}
/**
 *
 *
 * @param {string} uuid Subscriber Id
 * @returns {Promise}
 */
function getRetryByUuid(uuid) {
  return FloodControl.findOne({
    where: {
      uuid
    },
    attributes: ["retry"],
    raw: true
  });
}

module.exports = {
  invalidateOTP,
  findOTPRecord,
  invalidateFloodControl,
  deleteFloodControl,
  resetResendOTPCount,
  incrementFloodControlRetry,
  getRetryByUuid
};
