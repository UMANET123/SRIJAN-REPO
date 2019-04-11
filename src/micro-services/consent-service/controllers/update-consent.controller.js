/* jshint esversion:6 */
const { updateConsent } = require("../models/consent.model");
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
    appname
  } = req.body;
  if (
    !access_token ||
    !subscriber_id ||
    !app_id ||
    !developer_id ||
    !scopes ||
    !appname
  ) {
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
    (status, response) => {
      return res.status(status).send(response);
    }
  );
};
