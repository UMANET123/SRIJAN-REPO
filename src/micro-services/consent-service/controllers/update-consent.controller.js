/* jshint esversion:6 */
const { updateConsent } = require("../models/consent.model");
const logger = require("../logger");
/**
 * Update Consent Controller
 * @param {object} req Http Request
 * @param {object} res Http Response
 * @returns {object} Http Response
 *
 *
 */
module.exports = function(req, res) {
  let {
    subscriber_id,
    access_token,
    app_id,
    developer_id,
    scopes,
    appname,
    consent_expiry,
    consent_type
  } = req.body;
  if (
    !access_token ||
    !subscriber_id ||
    !app_id ||
    !developer_id ||
    !scopes ||
    !appname
  ) {
    logger.log("warn", "UpdateConsentController:", {
      message: "Invalid Parameters"
    });
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  updateConsent(
    subscriber_id,
    access_token,
    app_id,
    developer_id,
    scopes,
    appname,
    consent_expiry,
    consent_type,
    (status, response) => {
      return res.status(status).send(response);
    }
  );
};
