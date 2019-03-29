var express = require("express");
var app = express();
var session = require("express-session");

var bodyParser = require("body-parser");
var cookieParser = require("cookie-parser");
const paginate = require("express-paginate");
const { checkAndUpdateToken } = require("./middlewares/update-refresh-token");

const router = require("./router/index.router.js");

const cors = require("cors");
const { NODE_SETTINGS } = require("./config/environment");
app.set("view engine", "ejs");
app.use(cors());
app.use(bodyParser.json());

// keep this before all routes that will use pagination
app.use(paginate.middleware(10, 50));

app.use(express.static("public"));

global.viewspath = __dirname + "/views/";

app.use(cookieParser());
app.use(
  session({
    secret: "wakanda-subscriberapp",
    resave: true,
    cookie: { maxAge: NODE_SETTINGS.sessionIdleTime, path: "/" },
    rolling: true,
    saveUninitialized: true,
    name: "wakanda"
  })
);

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept"
  );
  next();
});
/* check access token expiry and regenerate
 * token hitting refresh token
 */
app.use(checkAndUpdateToken);

app.use("/", router);

app.use("*", function(req, res) {
  res.sendFile(viewspath + "404.html");
});

app.listen(5561, function() {
  console.log("app listening on port 5561!");
});
