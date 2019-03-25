const { generateTOtp } = require("../models/otp.model");
const subscriberNumber = require("../helpers/subscriber");

module.exports = function(req, res, next) {
  let { app_id, msisdn, blacklist } = req.body;
  //  check for  {app_id, msisdn, blacklist} exists
  if (!app_id || !msisdn || typeof blacklist != "boolean")
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  //   validate the number as per Philippines
  let isValidNumber = subscriberNumber.getTelco(msisdn);
  if (!isValidNumber.valid) {
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  //  generate otp model call
  return generateTOtp(msisdn, app_id, blacklist, (responseBody, status) => {
    res.status(status).send(responseBody);
  });
};
