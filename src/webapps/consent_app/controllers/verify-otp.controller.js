/* jshint esversion:9 */
const {
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_ENDPOINTS: { verifyOTP }
} = require("../config/environment");

const request = require("request");
const getEncodedString = require("../utility/get-encoded-data");
module.exports = function(req, res, next) {
  let { otp, transaction_id } = req.body;

  var options = {
    method: "POST",
    url: `${apigeeBaseURL}/${verifyOTP}`,
    headers: {
      "cache-control": "no-cache",
      Authorization: `Basic ${getEncodedString()}`,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: { otp, transaction_id }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    var res_data = {};
    res_data.statusCode = response.statusCode;
    // succees rseponse
    if (response.statusCode == 302) {
      res_data.message = "Success.";
      sess = req.session;
      sess.sessionid = transaction_id;
      let location = response.headers.location;
      let authCode = getQueryParamByName(location, "code");
      // * set sessions code, state
      res_data.redirect = location;

      // // ! need to comment before push (for local only)  -------
      // res_data.redirect = location.replace("13.232.77.36", "localhost");
      // // ! need to comment before push (for local only)  -------

      // (authCode == true) means its cosent skip case
      // need to redirect URL to developer App
      if (authCode) {
        //  destroy session
        req.session.destroy(function(err) {
          if (err) {
            console.log(err);
          } else {
            return res.status(response.statusCode).send(res_data);
          }
        });
      } else {
        //  set app name, message to session
        sess.app_name = getQueryParamByName(location, "app_name");
        sess.app_message = getQueryParamByName(location, "app_message");
        return res.status(response.statusCode).send(res_data);
      }
    } else if (response.statusCode == 403) {
      // forbidden response
      return res.status(response.statusCode).send(JSON.parse(body));
    } else {
      //  any other errors
      res_data.error_message = "Invalid OTP.";
      return res.status(response.statusCode).send(res_data);
    }
  });
};
/**
 *
 * * Get query string value by passing key
 * @param {*} url URL string
 * @param {*} keyName query string key name
 * @returns {string} query string value of key
 */
function getQueryParamByName(url, keyName) {
  var match = RegExp("[?&]" + keyName + "=([^&]*)").exec(url);
  return (
    match && decodeURIComponent(match[1].replace(/\+/g, " ").replace(/\t/g, ""))
  );
}
