const generateTOtp = require("../models/generateTOtp/generateTOtp");
const subscriberNumber = require("../helpers/subscriber");
const logger = require("../logger");
module.exports = async function(req, res, next) {
  let { app_id, msisdn, blacklist } = req.body;
  //  check for  {app_id, msisdn, blacklist} exists
  if (!app_id || !msisdn || typeof blacklist != "boolean") {
    logger.log("warn", "GenerateTOTPController:InvalidParameters", {
      message: JSON.stringify({app_id, msisdn, blacklist})
    });

    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  //   validate the number as per Philippines
  let isValidNumber = subscriberNumber.getTelco(msisdn);
  if (!isValidNumber.valid) {
    logger.log("warn", "GenerateTOTPController:InvalidPhoneNumber", {
      message: `${msisdn}`
    });
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
    logger.log("error", "GenerateTOTPController:InternalServerError", {
      message: `${err}`
    });
    return res.status(500).send({
      error_code: "InternalServerError",
      error_message: "Internal Server Error"
    });
  }
};
