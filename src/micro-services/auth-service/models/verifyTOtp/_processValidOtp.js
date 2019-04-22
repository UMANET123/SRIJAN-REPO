/*jshint esversion: 8 */
const {
  deleteFloodControl,
  invalidateOTP,
  resetResendOTPCount
} = require("./_util");
/**
 *
 * process Valid OTP
 * @param {string} subscriber_id Subscriber Id
 * @param {string} app_id App Id
 * @returns {Promise} Resolve Promise Return body , status in an object
 */
module.exports = function(subscriber_id, app_id) {
  // Delete the flood control
  return new Promise(async resolve => {
    // try {
    await deleteFloodControl(subscriber_id, app_id);
    //  invalidate OTP
    await invalidateOTP(subscriber_id, app_id);
    //  reset OTP record resend Count to 0
    await resetResendOTPCount(subscriber_id, app_id, 0);
    //  return response
    return resolve({ body: null, status: 200 });
  });
};
