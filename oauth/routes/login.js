//Handler for Login
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
  var basePath = "/oauth/v2";
  res.render("login", {
    result: result,
    basePath: basePath,
    data: data
  });
};