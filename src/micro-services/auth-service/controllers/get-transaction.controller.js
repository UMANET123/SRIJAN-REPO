/* jshint esversion:6 */
const { getTransaction } = require("../models/transaction.model");
/**
 *
 * Create Transaction Controller
 * @param {Object} req Http Request
 * @param {Object} res Http Response
 * @returns {Object} res Http Response
 */
module.exports = function(req, res) {
  //  invoke create transaction model for transaction
  let { transaction_id } = req.params;
  return getTransaction(transaction_id, (status, responseBody) => {
    res.status(status).send(responseBody);
  });
};
