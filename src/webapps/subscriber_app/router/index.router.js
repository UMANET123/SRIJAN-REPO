const express = require('express')
let router = express.Router();


var subscriberUtil = require('../utility/subscriber');
const generateTotpController = require('../controllers/generate-otp.controller');
const verifyTotpController = require('../controllers/verify-otp.controller');
const updateConsentController = require('../controllers/update-consent.controller');

var sess;
router.get("/", function (req, res) {
	sess = req.session;
	
	if (sess.sessionid){
		res.redirect('/dashboard');
	} else {
		res.render('index') 
		// res.sendFile(viewspath + "index.html");
	}
});

router.get("/dashboard", function (req, res) {
	sess = req.session;
	if (sess.sessionid ){
		
	
		res.render('dashboard') 
		
	} else {
		res.redirect('/logout');
	}
});

router.get("/logout", function (req, res) {
	req.session.destroy(function(err) {
		if(err) {
		  console.log(err);
		} else {
		  res.redirect('/');
		}
	});
});

router.get('/api/validateMobileNo', function (req, res){
	phone_no = req.query.phone_no
	var number = subscriberUtil.getTelco(phone_no)
	res_data = {}
    if(!number.valid || number.telco !== 'globe') {
        res_data.error_code = "InvalidPhoneNo"
        res_data.error_message = 'Invalid Phone No.'
		res.statusCode = 400
		res.send(res_data);
	} else {
		res.statusCode = 200
		res.send(res_data);
	}
});
router.post('/api/generate/otp', generateTotpController);
router.post('/api/verify/otp', verifyTotpController);
router.post('/api/consent', updateConsentController)
// router.post('/verify/hotp', verifyHotpController);

// router.post('/verify/user', verifyUserController);
module.exports = router;