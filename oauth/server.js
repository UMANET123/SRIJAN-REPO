var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");
var cookieParser = require("cookie-parser");
var app = express();

var sessionOptions = {
  name: "sid",
  secret: "apigee123",
  cookie: {
    path: "/",
    maxAge: 1800000,
    secure: false,
    httpOnly: true
  },
  proxy: true,
  saveUninitialized: true,
  resave: true
};


// Handle sessions for all requests.
app.use(cookieParser());
app.use(session(sessionOptions));

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(bodyParser.json());
app.use("/oauth/v2", express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

// This function is used to check the existence of the user attribute from the
// session object.  If it's not available, we redirect back to the login page.
function restrict(req, res, next) {
  if (req.session.user) {
    next();
  } else {
    req.session.error = "Access denied!";
    res.redirect(
      302,
      "/oauth/v2" +
      "/login" +
      req.url.substring(req.url.indexOf("?"))
    );
  }
};
// Route to login ( Display Login page )
app.get("/oauth/v2/login", require("./routes/login").get);
// Route for Consent ( Display Consent Page )
app.get("/oauth/v2/consent", restrict, require("./routes/consent").get);


app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function () {
  console.log("Node HTTP server is listening on port " + app.get("port"));
});