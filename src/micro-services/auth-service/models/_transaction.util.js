const pool = require("../config/db");
const { getNewSecret } = require("./helper.model");
const { TransactionData } = require("../config/models");
//  create a transaction
function createTransaction(...args) {
  let [txnId, subscriberId, appId, currentDate, status, callback] = args;
  if (!txnId) {
    //  create txnid
    let secret_key = subscriberId + appId + currentDate.getTime();
    txnId = getNewSecret(secret_key);
  }
  //  create a transaction record
  TransactionData.create({
    transaction_id:txnId,
    uuid: subscriberId,
    app_id: appId,
    created: currentDate,
    status: status
  }).then(()=>{
    callback(txnId)
  })
}

module.exports = { createTransaction };
