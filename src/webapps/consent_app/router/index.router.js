const express = require('express')
let router = express.Router();

var request = require('request');
const generateTotpController = require('../controllers/generate-otp.controller');
const verifyTotpController = require('../controllers/verify-otp.controller');
// const verifyHotpController = require('../controllers/verify-hotp.controller');
// const verifyTotpController = require('../controllers/verify-topt.controller');
// var path = __dirname + '/views/';
router.get("/", function (req, res) {
	res.sendFile(viewspath + "index.html");
});


router.post('/api/generate/otp', generateTotpController);
router.post('/api/verify/otp', verifyTotpController);
// router.post('/verify/hotp', verifyHotpController);

// router.post('/verify/user', verifyUserController);
module.exports = router;