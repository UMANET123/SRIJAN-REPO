/*jshint esversion:6 */
const pool = require("../config/db");
const { getNewSecret } = require("./helper.model");
const { TransactionData } = require("../config/models");
//  create a transaction
/**
 *
 *
 * @param {} args must contain following list of params
 * - txnId  {string} Transaction Id
 * - subscriberId {string}  Subscriber Id
 * - appId {string} App Id
 * - currentDate {Date} Current Date/Time
 * - status {number} Status of the Transaction
 *
 * Function will create Transaction record and after success invoke
 * the callback with passing the txnId
 */
function createTransaction(...args) {
  let [txnId, subscriberId, appId, currentDate, status, callback] = args;
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
