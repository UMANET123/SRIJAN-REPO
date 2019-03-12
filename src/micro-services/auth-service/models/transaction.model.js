const pool = require("../config/db");
const { TransactionData } = require("../config/models");
//  validate a transaction
/**
 *
 *
 * @param {array} args Following Arguments are needed to pass
 * - reqParams {object} Path params
 *   - transaction_id Transaction Id
 *   - subscriber_id Subscriber Id
 *   - app_id App Id
 * - callback Callback Function
 *
 * @returns {callback} Callback Function
 *
 * It will validate transaction and return callback
 * with passing boolean value
 */
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
/**
 *
 *
 * @param {array} args Following Arguments are needed to pass
 * - reqParams {object} Path params
 *   - transaction_id Transaction Id
 * - reqBody {object} Body
 *   - subscriber_id Subscriber Id
 *   - app_id App Id
 * - callback Callback Function
 * @returns {function} callback callback function
 *
 * invalidate a transaction and then
 * invoke callback
 *
 */
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
        app_id: app_id,
        status: 0
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
