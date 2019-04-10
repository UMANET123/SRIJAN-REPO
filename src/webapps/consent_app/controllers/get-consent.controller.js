/* jshint esversion:9 */

const request = require("request");

const {
  APIGEE_CREDS: { apigeeBaseURL },
  APIGEE_ENDPOINTS: { validateTransaction }
} = require("../config/environment");

// * get consent page with data
module.exports = (req, res) => {
  console.log("get consent called");
  sess = req.session;
  if (sess.sessionid) {
    console.log(req.query);
    let appName = req.query.app_name || "Developer Application";
    let appMessage = req.query.app_message || "";
    // * Get Scopes by calling validate Transaction
    request(
      `${apigeeBaseURL}/${validateTransaction}/${sess.sessionid}`,
      function(error, response, body) {
        if (error) throw new Error(error);
        console.log({ body, response });
        let { scopes } = JSON.parse(body);
        // sess.redirect_uri = req.query.redirect_uri;
        // sess.transaction_id = req.query.transaction_id;
        return res.render("consent", { appName, appMessage, scopes });
      }
    );
  } else {
    return res.redirect("/logout");
  }
};
