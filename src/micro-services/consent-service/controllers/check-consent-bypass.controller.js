/* jshint esversion:6 */
const { skipConsent } = require("../models/skip-consent.model");
/**
 *
 * CheckBlackList Controller
 * @param {object} req http request
 * @param {object} res http response
 * @returns {object}  http response
 */
module.exports = (req, res) => {
  //  check app is blacklisted

  skipConsent(req.params, (response, status) => {
    return res.status(status).send(response);
  });
};
