const {
  NODE_SETTINGS,
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_CREDS: { clientID },
  APIGEE_CREDS: { clientSecret },
  APIGEE_ENDPOINTS: { searchApps }
} = require("../config/environment");

var request = require("request");
var session = require("express-session");
module.exports = function(req, res, next) {
  sess = req.session;

  let sub_access_token = sess.access_token;
  var authorizationHeaderString = "Bearer " + sub_access_token;
  let { appname } = req.query;
  let reqUrl = `${apigeeBaseURL}/${searchApps}`;
  if (appname) reqUrl = `${reqUrl}?appname=${appname}`;
  console.log({ reqUrl });
  var options = {
    method: "GET",
    url: reqUrl,
    headers: {
      "cache-control": "no-cache",
      Authorization: authorizationHeaderString,
      "Content-Type": "application/json"
    }
  };

  request(options, function(error, response, body) {
    if (error) throw new Error(error);
    // console.log(response.statusCode);
    // console.log();

    var res_data = {};
    sess = req.session;
    res_data.statusCode = response.statusCode;
    // console.log(response.body);
    if (response.statusCode == 200) {
      body_data = JSON.parse(body);

      res_data.appname = body_data["appname"];
    } else {
      res_data.error_message =
        "There are some error during perform operations.";
    }
    res.send(res_data);
  });
};
