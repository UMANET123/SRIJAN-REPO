/* jshint esversion:6 */
const { revokeAll } = require("../models/revoke.model");
const logger = require("../logger");
/**
 * RevokeAllAppConsent Controller
 * @param {object} req Http Request
 * @param {object} res Http Response
 * @returns {object} Http Response
 *
 *
 */
module.exports = (req, res) => {
  let { subscriber_id } = req.body;
  //  throw bad request for absence of parameter
  if (!subscriber_id) {
    logger.log("warn", "RevokeAllAppConsentController:", {
      message: "Invalid Parameters"
    });
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  revokeAll(subscriber_id, (status, response) => {
    return res.status(status).send(response);
  });
};
