const { generateTOtp } = require("../models/otp.model");
const subscriberNumber = require("../helpers/subscriber");

module.exports = async function(req, res, next) {
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
  try {
    let { status, body } = await generateTOtp(msisdn, app_id, blacklist);
    return res.status(status).send(body);
  } catch (err) {
    console.log(err);
  }
};
