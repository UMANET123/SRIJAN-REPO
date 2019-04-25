/* jshint esversion:6 */
const { getTransaction } = require("../models/transaction.model");
const logger = require("../logger");
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
  if (!transaction_id) {
    logger.log("warn", "GetTransactionController:InvalidParameters", {
      message: JSON.stringify({transaction_id})
    });
    return res
      .status(400)
      .send({ error_code: "BadRequest", error_message: "Bad Request" });
  }
  return getTransaction(transaction_id, (status, responseBody) => {
    return res.status(status).send(responseBody);
  });
};
