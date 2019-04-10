/* jshint esversion:9 */
const {
  NODE_SETTINGS,
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_ENDPOINTS: { generateOTP }
} = require("../config/environment");

const request = require("request");
module.exports = function(req, res, next) {
  //   var subscribers = [];

  // var encodedData = Buffer.from(clientID + ':' + clientSecret).toString('base64');
  // var authorizationHeaderString = 'Basic ' + encodedData;
  //  console.log(authorizationHeaderString);
  const options = {
    method: "POST",
    url: `${apigeeBaseURL}/${generateOTP}`,
    headers: {
      "cache-control": "no-cache",
      //   Authorization: authorizationHeaderString,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: { ...req.body }
    // qs: { client_id: client_id }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    let res_data = {};
    let { otp } = JSON.parse(body);
    res_data.statusCode = response.statusCode;
    if (response.statusCode == 201) {
      res_data.message = "OTP has send to your mobile successfully.";
      res_data.otp = otp;
    } else {
      res_data.error_code = body_data.error_code;
      res_data.error_message = body_data.error_message;
    }
    res.send(res_data);
  });
};
