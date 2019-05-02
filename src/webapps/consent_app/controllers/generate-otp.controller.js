/* jshint esversion:9 */
const {
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_ENDPOINTS: { generateOTP }
} = require("../config/environment");
const getEncodedString = require("../utility/get-encoded-data");
// console.log({ testencode: getEncodedString() });
const request = require("request");
module.exports = function(req, res, next) {
  const options = {
    method: "POST",
    url: `${apigeeBaseURL}/${generateOTP}`,
    headers: {
      "cache-control": "no-cache",
      Authorization: `Basic ${getEncodedString()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: { ...req.body }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    let { otp, error_code, error_message } = JSON.parse(body);
    let resData = {};
    resData.statusCode = response.statusCode;
    if (response.statusCode == 201) {
      resData.message = "OTP has send to your mobile successfully.";
      resData.otp = otp;
    } else if (
      error_code == "Forbidden" &&
      error_message == "App is blacklisted"
    ) {
      resData.redirect_blacklist_uri =
        req.headers.origin + "/alert/app-blacklisted";
    } else {
      resData.error_code = error_code;
      resData.error_message = error_message;
    }
    res.send(resData);
  });
};
