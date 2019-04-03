const { createTransaction } = require("../models/transaction.model");
/**
 *
 * Create Transaction Controller
 * @param {Object} req Http Request
 * @param {Object} res Http Response
 * @returns {Object} res Http Response
 */
module.exports = function(req, res) {
  //  invoke create transaction model for transaction
  return createTransaction(req.body, (responseBody, status) => {
    res.status(status).send(responseBody);
  });
};
