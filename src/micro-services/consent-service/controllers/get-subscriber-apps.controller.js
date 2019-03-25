/* jshint esversion:6 */
const { getSubscriberApps } = require("../models/subscriber.model");
/**
 *
 *
GetSubscriberAppsList Controller
 * @param {object} req http request
 * @param {object} res http response
 * @returns {object}  http response
 */
module.exports = (req, res) => {
  //  subscriber id from path params : required
  let { subscriber_id } = req.params;
  //  appname from query params optional
  let { appname } = req.query;
  //  model method

  getSubscriberApps(subscriber_id, appname, (status, response) => {
    return res.status(status).send(response);
  });
};
