let env = process.env.NODE_ENV;
var getHost = function (req) {
  return req.hostname.indexOf("localhost") != -1 ?
    "localhost:3333" :
    req.hostname;
};

// support running the webapp locally vs. in Apigee cloud
var getBasePath = function (req) {
  return "/oauth/v2";
};

// support running the webapp locally vs. in Apigee cloud
var getUrlScheme = function (req) {
  return req.hostname.indexOf("localhost") != -1 ? "http" : "https";
};

exports.getHost = getHost;
exports.getBasePath = getBasePath;
exports.getUrlScheme = getUrlScheme;