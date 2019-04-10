const { verifyTOtp } = require("../models/otp.model");
const logger = require("../logger");
module.exports = function(req, res) {
  let { subscriber_id, otp, app_id } = req.body;
  if (!subscriber_id || !otp || otp.length < 6 || otp.length > 6) {
    logger.log("error", "VerifyTOTPController", {
      message: `Bad Request : Invalid Parameters Supplied`
    });
    return res.status(400).send({
      error_code: "BadRequest",
      error_message: "Bad Request"
    });
  }
  verifyTOtp(subscriber_id, otp, app_id, (response, status) => {
    return res.status(status).send(response);
  });
};
