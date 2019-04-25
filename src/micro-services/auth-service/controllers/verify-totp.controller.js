const logger = require("../logger");
const verifyTOtp = require("../models/verifyTOtp/verifyTOtp");
module.exports = async (req, res) => {
  let { subscriber_id, otp, app_id } = req.body;
  //  OTP string length Must be 6
  // Subscriber ID , OTP, App ID must be in request payload
  if (!subscriber_id || !otp || !app_id) {
    logger.log("warn", "VerifyTOTPController:InvalidParameters", {
      message: JSON.stringify({subscriber_id, otp, app_id})
    });
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }

  if (otp.length != 6) {
    logger.log("warn", "VerifyTOTPController:InvalidOTP", {
      message: `${otp} length : ${otp.length}`
    });
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Invalid OTP"
    });
  }
  try {
    let { status, body } = await verifyTOtp(subscriber_id, otp, app_id);
    return res.status(status).send(body);
  } catch (err) {
    logger.log("error", "VerifyTOTPController:InternalServerError", {
      message: `${err}`
    });
    return res.status(500).send({
      error_code: "InternalServerError",
      error_message: "Internal Server Error"
    });
  }
};
