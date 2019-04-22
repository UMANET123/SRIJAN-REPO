/*jshint esversion: 8 */
const { incrementFloodControlRetry, getRetryByUuid } = require("./_util");
/**
 *
 * Handler of Invalid OTP record
 * @param {string} subscriber_id Subscriber Id
 * @param {string} app_id App Id
 * @returns {Promise} resolve Promise with retry value
 */
module.exports = function(subscriber_id, app_id) {
  return new Promise(async resolve => {
    await incrementFloodControlRetry(subscriber_id, app_id);
    let { retry } = await getRetryByUuid(subscriber_id, app_id);
    return resolve(retry);
  });
};
