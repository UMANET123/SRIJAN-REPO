/* jshint esversion:6 */
const { createBlackList } = require("../models/blacklist.model");
/**
 *
 *
 CreateBlackList Controller
 * @param {object} req http request
 * @param {object} res http response
 * @returns {object}  http response
 */
module.exports = (req, res) => {
  //  get  required elements  from request body
  let { subscriber_id, app_id, developer_id } = req.body;
  //  reject the response for absense of any required elements
  if (!subscriber_id || !app_id || !developer_id) {
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  //  create a black list app record
  createBlackList(req.body, (status, response) => {
    return res.status(status).send(response);
  });
};
