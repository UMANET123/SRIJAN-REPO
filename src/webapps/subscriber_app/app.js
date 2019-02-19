var express = require("express");
var app = express();
var session = require("express-session")
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');

const router = require('./router/index.router.js');

app.set('view engine', 'ejs');

app.use(bodyParser.json());

app.use(express.static('public'));

global.viewspath = __dirname + '/views/';

router.use(function (req, res, next) {
	console.log("/" + req.method);
	next();
});

app.use(session({
	secret: 'wakanda-subscriberapp', 
	resave: true
	}
));

app.use("/", router);

app.use("*", function (req, res) {
	res.sendFile(viewspath + "404.html");
});

app.listen(5561, function () {
	console.log('app listening on port 5561!')
})