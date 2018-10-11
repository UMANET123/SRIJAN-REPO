var express = require("express");
var bodyParser = require("body-parser");
var path = require("path");
var session = require("express-session");
var cookieParser = require("cookie-parser");

var utils = require("./lib/utils");
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
app.use(express.static(path.join(__dirname, "public")));
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
      utils.getBasePath(req) +
      "/login" +
      req.url.substring(req.url.indexOf("?"))
    );
  }
}

app.get("/login", require("./routes/login").get);

// app.post("/login", require("./routes/login").post);

app.get("/consent", restrict, require("./routes/consent").get);

// app.post("/consent", restrict, require("./routes/consent").post);

app.set("port", process.env.PORT || 3000);
app.listen(app.get("port"), function () {
  console.log("Node HTTP server is listening on port " + app.get("port"));
});