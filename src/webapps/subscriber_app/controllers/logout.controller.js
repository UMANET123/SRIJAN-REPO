/* jshint esversion:6 */
const request = require("request");
const {
  APIGEE_CREDS: { apigeeBaseURL, clientID, clientSecret },
  APIGEE_ENDPOINTS: { logout }
} = require("../config/environment");

/**
 *
 * Logout Controller
 * @param {object} req Http Request
 * @param {object} res Http Response
 * @returns {object} Http response
 *
 */
module.exports = (req, res) => {
  // base64 encoded data
  const encodedData = Buffer.from(clientID + ":" + clientSecret).toString(
    "base64"
  );
  //  authorization string
  const authorizationHeaderString = "Basic " + encodedData;
  //    request payload config
  const options = {
    method: "DELETE",
    url: `${apigeeBaseURL}/${logout}`,
    headers: {
      "cache-control": "no-cache",
      Authorization: authorizationHeaderString,
      "Content-Type": "application/x-www-form-urlencoded"
    },
    //  form body
    form: { access_token: req.session.access_token }
  };
  // request apigee logout endpoint
  request(options, (error, response, body) => {
    if (error) throw new Error(error);
    // destroy app session
    req.session.destroy(err => {
      if (err) throw new Error(err);
      return res.redirect("/");
    });
  });
};
