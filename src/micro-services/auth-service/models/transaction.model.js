/* jshint esversion:9 */
// const pool = require("../config/db");
const { TransactionData } = require("../config/models");
// const { getNewSecret, getRandomString } = require("../models/helper.model");
const uuidv4 = require("uuid/v4");
/**
 * Function will create Transaction record and after success invoke
 * the callback with passing the txnId
 * @param {Object} reqBody Http Request Body Object
 *  - response_type string
 *  - client_id {string} Client Id
 *  - redirect_uri {string} Redirect URL
 *  - scopes {Array} Consent Scopes
 *  - state  {string} State
 *  - auth_state  {string} Auth State
 *  - app_id  {string} App Id
 *  - developer_id  {string} Developer Id
 * @param {function} callback Callback after success/fail
 * @returns {string} returns transaction_id via the callback for success
 */
function createTransaction(reqBody, callback) {
  let {
    response_type,
    client_id,
    redirect_uri,
    scopes,
    state,
    auth_state,
    app_id,
    developer_id
  } = reqBody;
  // create secret key for txnId
  //  create a transaction record
  let transactionId = uuidv4();
  return TransactionData.create({
    transaction_id: transactionId,
    response_type,
    client_id,
    redirect_uri,
    scopes,
    state,
    auth_state,
    app_id,
    developer_id,
    status: 0
  })
    .then(() => callback({ transaction_id: transactionId }, 201))
    .catch(e => {
      console.log(e);
      return callback(
        {
          error_code: "InternalServerError",
          error_message: "Internal Server Error"
        },
        500
      );
    });
}
/**
 * Function will get the Transaction record of transaction id and return
 * a callback with transaction attributes/fields
 * @param {string} transactionId Tranasaction ID
 * @param {function} callback Callback after success/fail
 * @returns {function} transaction Object having following attributes
 *  - response_type string
 *  - client_id {string} Client Id
 *  - redirect_uri {string} Redirect URL
 *  - scopes {Array} Consent Scopes
 *  - state  {string} State
 *  - auth_state  {string} Auth State
 *  - app_id  {string} App Id
 *  - developer_id  {string} Developer
 *  passing in the callback for success
 */
function getTransaction(transactionId, callback) {
  //  check if there is transaction id has falsy/null values
  if (!transactionId)
    return callback(
      {
        error_code: "BadRequest",
        error_message: "Bad Request"
      },
      400
    );
  //  find transaction
  return TransactionData.findOne({
    where: {
      transaction_id: transactionId,
      status: 0
    },
    attributes: [
      "response_type",
      "client_id",
      "redirect_uri",
      "scopes",
      "state",
      "auth_state",
      "subscriber_id",
      "app_id",
      "developer_id"
    ]
  })
    .then(transactionRecord => {
      if (!transactionRecord) return callback(204, null);
      let {
        response_type,
        client_id,
        redirect_uri,
        scopes,
        state,
        auth_state,
        subscriber_id,
        app_id,
        developer_id
      } = transactionRecord;
      return callback(200, {
        response_type,
        client_id,
        redirect_uri,
        scopes,
        state,
        auth_state,
        subscriber_id,
        app_id,
        developer_id
      });
    })
    .catch(e => {
      console.log(e);
      return callback(500, {
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      });
    });
}

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
  })
    .then(result => {
      if (result) {
        return callback(200, { is_valid: true });
      } else {
        return callback(200, { is_valid: false });
      }
    })
    .catch(e => {
      return callback(500, {
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      });
    });
}

//  invalidate a transaction
/**
 *
 *
 * @param {array} args Following Arguments are needed to pass
 * - reqParams {object} Path params
 *   - transaction_id Transaction Id
 * - callback Callback Function
 * @returns {function} callback callback function
 *
 * invalidate a transaction and then
 * invoke callback
 *
 */
function invalidateTransaction(transactionId, callback) {
  // create a transaction record
  return TransactionData.update(
    {
      status: 1
    },
    {
      where: {
        transaction_id: transactionId,
        status: 0
      },
      returning: true
    }
  )
    .then(transactionResponse => {
      console.log(transactionResponse);
      let [recordCount, response] = transactionResponse;

      if (response.length > 0) {
        return callback(200, null);
      } else {
        return callback(403, {
          error_code: "Forbidden",
          error_message: "Forbidden"
        });
      }
    })
    .catch(e => {
      console.log("ERROR IN INVALIDATE : ", e);
      return callback(500, {
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      });
    });
}
/**
 *
 *
 * @param {string} transactionId Transaction Id
 * @param {object} reqBody request Body Object with following optional parameter
 *  - response_type string
 *  - client_id {string} Client Id
 *  - redirect_uri {string} Redirect URL
 *  - scopes {Array} Consent Scopes
 *  - state  {string} State
 *  - auth_state  {string} Auth State
 *  - app_id  {string} App Id
 *  - developer_id  {string} Developer Id
 *
 * @param {function} callback callback function
 * @returns {function} callback function with Transaction Object with following attributes
 *  - response_type string
 *  - client_id {string} Client Id
 *  - redirect_uri {string} Redirect URL
 *  - scopes {Array} Consent Scopes
 *  - state  {string} State
 *  - auth_state  {string} Auth State
 *  - app_id  {string} App Id
 *  - developer_id  {string} Developer Id
 */
function updateTransaction(transactionId, reqBody, callback) {
  // update a transaction record
  return TransactionData.update(
    {
      ...reqBody,
      updated_at: new Date()
    },
    {
      where: {
        transaction_id: transactionId,
        status: "0"
      },
      returning: true
    }
  )
    .then(updatedTransaction => {
      let [recordCount, record] = updatedTransaction;
      //  no record updated/found
      if (!record[0]) return callback(204, null);
      let {
        response_type,
        client_id,
        redirect_uri,
        scopes,
        state,
        auth_state,
        subscriber_id,
        app_id,
        developer_id
      } = record[0].dataValues;
      //  record updated
      return callback(200, {
        response_type,
        client_id,
        redirect_uri,
        scopes,
        state,
        auth_state,
        subscriber_id,
        app_id,
        developer_id
      });
    })
    .catch(e => {
      console.log("ERROR IN UPDATE : ", e);
      return callback(500, {
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      });
    });
}

module.exports = {
  validateTransaction,
  invalidateTransaction,
  createTransaction,
  getTransaction,
  updateTransaction
};
