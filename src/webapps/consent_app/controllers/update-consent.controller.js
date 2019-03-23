const {
  NODE_SETTINGS,
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_CREDS: { clientID },
  APIGEE_CREDS: { clientSecret },
  APIGEE_ENDPOINTS: { updateConsent }
} = require("../config/environment");

var request = require("request");
var session = require("express-session");
module.exports = function(req, res, next) {
  let subscriber_id = req.body.subscriber_id;
  sess = req.session;
  console.log("subscriber id - ");
  console.log(sess.subscriber_id);
  let scopes = req.body.scopes;
  let client_id = sess.client_id;
  var encodedData = Buffer.from(clientID + ":" + clientSecret).toString(
    "base64"
  );
  var authorizationHeaderString = "Basic " + encodedData;
  console.log(authorizationHeaderString);
  var options = {
    method: "POST",
    url: `${apigeeBaseURL}/${updateConsent}`,
    headers: {
      "cache-control": "no-cache",
      Authorization: authorizationHeaderString,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    form: {
      subscriber_id: sess.subscriber_id,
      //  subscriber_consent: '["LOCATION"]',
      subscriber_consent: scopes,
      response_type: "code",
      redirect_uri: sess.redirect_uri,
      transaction_id: sess.transaction_id
    },
    qs: { client_id: client_id }
  };
  console.log(options);
  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    console.log(response.statusCode, response.headers.location);

    //  for local dev
    // let req_uri = `curl -X POST "https://globeslingshot-dev-labs.apigee.net/auth/v1/generate/token" -H "Authorization: Basic REPLACE_BASE64_TOKEN_CLIENT_ID_SECRET_ID" -H "Cache-Control: no-cache" -H "Content-Type: application/x-www-form-urlencoded" -d "subscriber_id=${
    //   sess.subscriber_id
    // }&grant_type=authorization_code&code=${response.headers.location
    //   .split("=")[1]
    //   .trim()}&redirect_uri=http%3A%2F%2F13.232.77.36%3A5560&transaction_id=${
    //   sess.transaction_id
    // }"`;
    // console.log({
    //   base64token_cmd: `echo -n "$client_id:$secret_id" | base64`
    // });
    // console.log({ access_token_url: req_uri });
    // for local dev

    var res_data = {};
    res_data.statusCode = response.statusCode;

    if (response.statusCode == 302) {
      sess.success_redirect_uri = response.headers.location;

      //   for local only  ------- ************
      // res_data.redirect_uri = sess.redirect_uri.replace("13.232.77.36","localhost");
      //   for local only  ------- ************
      res.status(response.statusCode).send(res_data);
    } else {
      res_data.error_message = "Invalid request";
      res.status(response.statusCode).send(res_data);
    }
  });
};
