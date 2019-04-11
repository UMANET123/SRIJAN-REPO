/* jshint esversion:6 */
const { createConsent } = require("../models/consent.model");
const logger = require('../logger');
/**
 *
 * Create Consent Controller
 * @param {object} req Http Request
 * @param {object} res Http Response
 * @returns {object} Http Response
 */
module.exports = function(req, res) {
  let {
    subscriber_id,
    app_id,
    developer_id,
    scopes,
    appname,
    access_token
  } = req.body;
  if (!subscriber_id || !app_id || !developer_id || !scopes || !appname) {
    logger.log("warn", "CreateConsentController:", {
      message: "Invalid Parameters"
    });
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  createConsent(
    subscriber_id,
    app_id,
    developer_id,
    scopes,
    appname,
    access_token,
    (status, response) => {
      return res.status(status).send(response);
    }
  );
};
