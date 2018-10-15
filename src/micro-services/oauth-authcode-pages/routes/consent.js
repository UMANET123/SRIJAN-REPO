// Handler for Consent page
exports.get = function(req, res) {
  var data = {
    client_id: req.query.client_id,
    scope: req.query.scope.split(","),
    state: req.query.state,
    redirect_uri: req.query.redirect_uri,
    app: req.query.app
  };

  var basePath = "/oauth/v2";

  res.render("consent", {
    basePath: basePath,
    data: data
  });
};