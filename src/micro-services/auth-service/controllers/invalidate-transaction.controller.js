const { invalidateTransaction } = require("../models/transaction.model");
/**
 *
 * Update Transaction Controller
 * @param {Object} req Http Request
 * @param {Object} res Http Response
 * @returns {Object} res Http Response
 */
module.exports = (req, res) => {
  //  invoke validate transaction model
  let { transaction_id } = req.params;
  return invalidateTransaction(transaction_id, (status, response) => {
    return res.status(status).send(response);
  });
};
