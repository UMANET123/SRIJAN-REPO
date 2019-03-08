const pool = require("../config/db");
const { TransactionData } = require("../config/models");
//  validate a transaction
function validateTransaction(...args) {
  let [reqParams, callback] = args;
  let { transaction_id, subscriber_id, app_id } = reqParams;
  //  create a transaction record
  return TransactionData.findOne({
    where: {
      transaction_id: transaction_id,
      uuid: subscriber_id,
      app_id: app_id,
      status: 0
    }
  }).then(result => {
    if (result) {
      return callback(200, { is_valid: true });
    } else {
      return callback(200, { is_valid: false });
    }
  });
}

//  invalidate a transaction
function invalidateTransaction(...args) {
  let [reqParams, reqBody, callback] = args;
  let { transaction_id } = reqParams;
  let { subscriber_id, app_id } = reqBody;
  // create a transaction record
  return TransactionData.update(
    {
      status: 1
    },
    {
      where: {
        transaction_id: transaction_id,
        uuid: subscriber_id,
        app_id: app_id
      }
    }
  ).then(result => {
    if (result) {
      return callback(200, null);
    } else {
      return callback(204, null);
    }
  });
}

module.exports = { validateTransaction, invalidateTransaction };
