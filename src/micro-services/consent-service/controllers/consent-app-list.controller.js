/* jshint esversion:6 */
const { getConsentList } = require("../models/consent.model");
/**
 *
 *  Consent AppList Controller
 * @param {object} req Http Request
 * @param {object} res Http Response
 * @returns {object} Http Response
 */
module.exports = (req, res) => {
  let { subscriber_id } = req.params;
  let { limit, page, appname } = req.query;
  getConsentList(subscriber_id, limit, page, appname, (status, response) => {
    return res.status(status).send(response);
  });
};
