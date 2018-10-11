var url = require("url");
var request = require("request");
var apigee = require("apigee-access");
var utils = require("../lib/utils");

exports.get = function(req, res) {
  var data = {
    client_id: req.query.client_id,
    scope: req.query.scope,
    state: req.query.state,
    redirect_uri: req.query.redirect_uri,
    appName: req.query.app,
    appProducts: req.query.appProducts
  };

  var result = req.query.err
    ? "Login failed. Please check your email/password and try again"
    : undefined;
  var basePath = utils.getBasePath(req);

  res.render("login", {
    result: result,
    basePath: basePath,
    data: data
  });
};

exports.post = function(req, res) {
  var data = {
    client_id: req.query.client_id || "Wakanda",
    scope: req.query.scope || "Wakanda",
    state: req.query.state || "Wakanda",
    redirect_uri: req.query.redirect_uri || "Wakanda",
    appName: req.query.appName || "Wakanda",
    appProducts: req.query.appProducts || "Wakanda"
  };

  var email = req.body.email;
  var password = req.body.password;
  var basePath = utils.getBasePath(req);
  // TODO: Authenticate user with IAM Microservice
  // If Success, redirect to consent page
  // Else redirect to login page with result property set to error description.

  request.post(
    {
      url:
        "http://ec2-13-126-176-122.ap-south-1.compute.amazonaws.com:4000/login",
      body: req.body,
      json: true
    },
    function(error, response, body) {
      if (!error && response.statusCode === 200) {
        // Login success
        req.session.user = email || "Wakanda";
        delete req.query.err;

        res.redirect(
          url.format({
            pathname: basePath + "/consent",
            query: req.query
          })
        );
      } else if (!error && response.statusCode === 401) {
        // Login failed
        req.query.err = "loginfailed";
        res.redirect(
          url.format({
            pathname: basePath + "/login",
            query: req.query
          })
        );
      } else {
        // Target server error
      }
    }
  );
};
