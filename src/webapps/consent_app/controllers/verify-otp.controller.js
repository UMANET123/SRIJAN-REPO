const {
  NODE_SETTINGS,
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_CREDS: { clientID },
  APIGEE_CREDS: { clientSecret },
  APIGEE_ENDPOINTS: { verifyOTP }
} = require("../config/environment");

var request = require("request");
var session = require("express-session");
module.exports = function(req, res, next) {
  let subscriber_id = req.body.subscriber_id;
  let otp = req.body.otp;
  let client_id = req.body.client_id;

  var options = {
    method: "POST",
    url: `${apigeeBaseURL}/${verifyOTP}`,
    headers: {
      "cache-control": "no-cache",
      //  Authorization: authorizationHeaderString,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: { subscriber_id: subscriber_id, otp: otp },
    qs: { client_id: client_id }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    var res_data = {};
    res_data.statusCode = response.statusCode;
    if (response.statusCode == 302) {
      res_data.message = "Success.";
      sess = req.session;
      sess.sessionid = subscriber_id;
      sess.subscriber_id = subscriber_id;
      sess.client_id = client_id;
      console.log(subscriber_id);
      console.log(response.headers.location);
      res_data.redirect = response.headers.location;
      //   for local only  ------- ************
      res_data.redirect = response.headers.location.replace(
        "13.232.77.36",
        "localhost"
      );
      // //   for local only  ------- ************
      console.log(res_data.redirect);
    } else if (response.statusCode == 403) {
      let errorResponseBody = response.body;
      return res
        .status(response.statusCode)
        .send(JSON.parse(errorResponseBody));
    } else {
      res_data.error_message = "Invalid OTP.";
    }
    console.log(res_data);
    return res.status(response.statusCode).send(res_data);
  });
};
