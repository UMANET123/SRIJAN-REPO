/*jshint esversion:6 */
const pool = require("../config/db");
const { getNewSecret } = require("./helper.model");
const { TransactionData } = require("../config/models");

 /**
  * Function will create Transaction record and after success invoke
  * the callback with passing the txnId
  * @param {string} txnId Transaction ID
  * @param {string} subscriberId Subscriber ID
  * @param {string} appId App ID
  * @param {Date} currentDate Current Date/Time
  * @param {number} status Status of the Transaction
  * @param {function} callback Callback after success/fail
  * @returns {boolean} returns true/false via the callback
  */
function createTransaction(txnId, subscriberId, appId, currentDate, status, callback) {
  if (!txnId) {
    // create secret key for txnId
    let secret_key = subscriberId + appId + currentDate.getTime();
    //  create txnid
    txnId = getNewSecret(secret_key);
  }
  //  create a transaction record
  TransactionData.create({
    transaction_id: txnId,
    uuid: subscriberId,
    app_id: appId,
    created: currentDate,
    status: status
  }).then(() => {
    callback(txnId);
  });
}

module.exports = { createTransaction };
