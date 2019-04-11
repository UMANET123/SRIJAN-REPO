/* jshint esversion:6 */
const { getConsentList } = require("../models/consent.model");
const logger = require('../logger');
//  date predefined order types
const ORDER_TYPES = ["desc", "asc"];
/**
 *
 *  Consent AppList Controller
 * @param {object} req Http Request
 * @param {object} res Http Response
 * @returns {object} Http Response
 */

module.exports = (req, res) => {
  // console.log("running");
  let { subscriber_id } = req.params;
  let { limit, page, appname, order } = req.query;
  // console.log({ limit, page, appname, order });
  if (order) {
    // console.log({ order });
    if (!ORDER_TYPES.includes(order)) {
      // for invalid order type
      logger.log("warn", "GetConsentListController:", {
        message: "Invalid Parameters"
      });
      return res.status(400).send({
        error_code: "BadRequest",
        error_message: "Invalid Parameter"
      });
    }
  } else {
    //    default order desc
    order = ORDER_TYPES[0];
  }
  getConsentList(
    subscriber_id,
    limit,
    page,
    appname,
    order,
    (status, response) => {
      return res.status(status).send(response);
    }
  );
};
