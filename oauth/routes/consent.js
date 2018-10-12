var url = require("url");
var utils = require("../lib/utils");

exports.get = function(req, res) {
  var data = {
    client_id: req.query.client_id,
    scope: req.query.scope.split(","),
    state: req.query.state,
    redirect_uri: req.query.redirect_uri,
    appName: req.query.appName,
    appProducts: req.query.appProducts
  };

  var basePath = utils.getBasePath(req);

  res.render("consent", {
    basePath: basePath,
    data: data
  });
};

exports.post = function(req, res) {
  var decision = req.body.decision;
  var basePath = utils.getBasePath(req);

  if (decision == "true") {
    // Access granted
    res.redirect(
      url.format({
        pathname: "/userAuthorize",
        query: req.query
      })
    );
  } else {
    // Access Denied
    res.redirect(
      url.format({
        pathname: "/login",
        query: req.query
      })
    );
  }
};
