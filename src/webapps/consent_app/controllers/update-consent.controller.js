const {
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_ENDPOINTS: { updateConsent }
} = require("../config/environment");
// const session = require("express-session");
const request = require("request");
module.exports = function(req, res, next) {
  sess = req.session;
  let { subscriber_consent } = req.body;
  let options = {
    method: "POST",
    url: `${apigeeBaseURL}/${updateConsent}`,
    headers: {
      "cache-control": "no-cache",
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
          // ! for local only  ------- ************
          // sess.success_redirect_uri = response.headers.location.replace(
          //   "13.232.77.36",
          //   "localhost"
          // );
          // res_data.success_redirect_uri = response.headers.location.replace(
          //   "13.232.77.36",
          //   "localhost"
          // );
          // ! for local only  ------- ************
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
