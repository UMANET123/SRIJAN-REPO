const generateTOtp = require("../models/generateTOtp/generateTOtp");
const subscriberNumber = require("../helpers/subscriber");
const logger = require("../logger");
module.exports = async function(req, res, next) {
  let { app_id, msisdn, blacklist } = req.body;
  //  check for  {app_id, msisdn, blacklist} exists
  if (!app_id || !msisdn || typeof blacklist != "boolean") {
    logger.log("error", "GenerateTOTPController", {
      message: `Bad Request : Invalid Parameters Supplied`
    });

    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  //   validate the number as per Philippines
  let isValidNumber = subscriberNumber.getTelco(msisdn);
  if (!isValidNumber.valid) {
    logger.log("error", "GenerateTOTPController", {
      message: `Bad Request : Incorrect Phone number`
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
    console.log(err);
    return res.status(500).send({
      error_code: "InternalServerError",
      error_message: "Internal Server Error"
    });
  }
};
