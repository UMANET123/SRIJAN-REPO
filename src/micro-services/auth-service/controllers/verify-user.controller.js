/*jshint esversion: 6 */
const { verifyUser } = require("../models/auth.model");
const logger = require("../logger");
module.exports = function(req, res) {
  let { msisdn, subscriber_id } = req.body;
  console.log("*****", req.body);
  if ((!msisdn && !subscriber_id) || (msisdn && subscriber_id)) {
    logger.log("error", "VerifyUserController", {
      message: `Bad Request : Invalid Parameters Supplied`
    });
    return res
      .status(400)
      .send({ status: "Either msisdn or subscriber_id needed" });
  }

  verifyUser(msisdn, subscriber_id, (response, status) => {
    return res.status(status).send(response);
  });
};
