/* jshint esversion:6 */
const { getConsentList } = require("../models/consent.model");
//  order types
const ORDER_TYPES = ["asc", "desc"];
module.exports = (req, res) => {
  let { subscriber_id } = req.params;
  let { limit, page, appname, order } = req.query;
  if (order) {
    if (!ORDER_TYPES.includes(order)) {
      // for invalid order type
      return res.status(400).send({
        error_code: "BadRequest",
        error_message: "Invalid Parameter"
      });
    }
  } else {
    //    default order desc
    order = ORDER_TYPES[1];
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
