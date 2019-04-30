const {
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_ENDPOINTS: { updateConsent },
  APIGEE_CREDS: { clientID },
  APIGEE_CREDS: { clientSecret }
} = require("../config/environment");
// const session = require("express-session");
const request = require("request");
var encodedData = Buffer.from(clientID + ":" + clientSecret).toString("base64");
var authorizationHeaderString = "Basic " + encodedData;
module.exports = function(req, res, next) {
  sess = req.session;
  let { subscriber_consent } = req.body;
  let options = {
    method: "POST",
    url: `${apigeeBaseURL}/${updateConsent}`,
    headers: {
      "cache-control": "no-cache",
      Authorization: authorizationHeaderString,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: {
      subscriber_consent,
      transaction_id: sess.sessionid
    }
  };
  // console.log(options);
  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    let res_data = {};
    res_data.statusCode = response.statusCode;
    // console.log({
    //   location: response.headers.location
    // });
    if (response.statusCode == 302) {
      req.session.destroy(function(err) {
        if (err) {
          console.log(err);
        } else {
          res_data.success_redirect_uri = response.headers.location;
          // console.log({ sess });
          // // ! need to comment before push (for local only) ************
          // sess.success_redirect_uri = response.headers.location.replace(
          //   "13.232.77.36",
          //   "localhost"
          // );
          // res_data.success_redirect_uri = response.headers.location.replace(
          //   "13.232.77.36",
          //   "localhost"
          // );
          // // ! need to comment before push (for local only) ************
          res_data.message = "Success.";
          return res.status(response.statusCode).send(res_data);
        }
      });
    } else {
      res_data.error_message = "Invalid request";
      return res.status(response.statusCode).send(res_data);
    }
  });
};
