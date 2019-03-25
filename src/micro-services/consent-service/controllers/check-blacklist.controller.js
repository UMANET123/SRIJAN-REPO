/* jshint esversion:6 */
const { checkBlacklist } = require("../models/blacklist.model");
/**
 *
 * CheckBlackList Controller
 * @param {object} req http request
 * @param {object} res http response
 * @returns {object}  http response
 */
module.exports = (req, res) => {
  //  check app is blacklisted

  checkBlacklist(req.params, (status, response) => {
    return res.status(status).send(response);
  });
};
