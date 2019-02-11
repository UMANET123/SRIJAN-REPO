var express = require("express");
var app = express();

var router = express.Router();
var bodyParser = require('body-parser');
app.use(bodyParser.json());

app.use(express.static('public'));

var path = __dirname + '/views/';

var subscribers = [];

router.use(function (req, res, next) {
	console.log("/" + req.method);
	next();
});

app.get("/", function (req, res) {
	res.sendFile(path + "index.html");
});

app.post("/api/generate/otp", function (req, res) {
	console.log('TOTP generation ' + JSON.stringify(req.body));
	var subsciber = {};
	subsciber.phone_no = req.body.phone_no;


	subscribers.push(subsciber);

	return res.send(subsciber);
});

// Verify Otp
app.post("/api/verify/otp", function (req, res) {
	console.log('TOTP verification ' + JSON.stringify(req.body));
	var subsciber = {};
	subsciber.subscriber_id = req.body.subscriber_id;
	subsciber.otp = req.body.otp;

	subscribers.push(subsciber);

	return res.send(subsciber);
});

app.use("/", router);

app.use("*", function (req, res) {
	res.sendFile(path + "404.html");
});

app.listen(5560, function () {
	console.log('app listening on port 5560!')
})