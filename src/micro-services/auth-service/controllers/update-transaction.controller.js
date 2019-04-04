/* jshint esversion:6 */
const { updateTransaction } = require("../models/transaction.model");
/**
 *
 * Update Transaction Controller
 * @param {Object} req Http Request
 * @param {Object} res Http Response
 * @returns {Object} res Http Response
 */
module.exports = function(req, res) {
  //  invoke update transaction model for transaction
  let { transaction_id } = req.params;

  return updateTransaction(transaction_id, req.body, (status, responseBody) => {
    res.status(status).send(responseBody);
  });
};
