/* jshint esversion:9 */

const request = require("request");

const {
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_ENDPOINTS: { validateTransaction }
} = require("../config/environment");
const scopeTexts = require("../utility/scopes-text");
const getEncodedString = require("../utility/get-encoded-data");
// * get consent page with data
module.exports = (req, res) => {
  sess = req.session;
  if (sess.sessionid) {
    let appName = req.query.app_name || "Developer Application";
    let appMessage = req.query.app_message || "";
    // * Get Scopes by calling validate Transaction
    const options = {
      method: "GET",
      url: `${apigeeBaseURL}/${validateTransaction}/${sess.sessionid}`,
      headers: {
        "cache-control": "no-cache",
        Authorization: `Basic ${getEncodedString()}`,
        "Content-Type": "application/x-www-form-urlencoded"
      }
    };
    request(options, function(error, response, body) {
      if (error) throw new Error(error);
      // console.log({ body, response });
      let {
        scopes,
        redirect_uri,
        client_id,
        subscriber_id,
        app_id
      } = JSON.parse(body);
      sess.client_id = client_id;
      sess.redirect_uri = redirect_uri;
      sess.subscriber_id = subscriber_id;
      sess.app_id = app_id;
      return res.render("consent", {
        appName,
        appMessage,
        scopes,
        scopeDescription,
        redirect_uri
      });
    });
  } else {
    return res.redirect("/logout");
  }
};
/**
 *
 * * scopeDescription
 * @param {string} scope scope name
 * @returns {string} scope description
 */
function scopeDescription(scope) {
  scope = scope.toLowerCase().replace(/ /g, "");
  console.log(scope);
  if (scopeTexts[scope]) {
    return scopeTexts[scope];
  }
  return "";
}
