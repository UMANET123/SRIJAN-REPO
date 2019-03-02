const express = require('express')
let router = express.Router();
const paginate = require('express-paginate');
const axios = require('axios')

var subscriberUtil = require('../utility/subscriber');
const generateTotpController = require('../controllers/generate-otp.controller');
const verifyTotpController = require('../controllers/verify-otp.controller');
const revokeAppController = require('../controllers/revoke.controller');
const revokeAllAppsController = require('../controllers/revoke-all.controller');
const blacklistController = require('../controllers/blacklist.controller');
const consentList = require('../controllers/app-listing.controller')
const searchApps = require('../controllers/search-apps.controller')
// Search will go here
router.post('/api/generate/otp', generateTotpController);
router.post('/api/verify/otp', verifyTotpController);

router.post('/api/revokeallapps', revokeAllAppsController);
router.post('/api/blacklist', blacklistController);
router.get('/api/search', searchApps);


router.get("/", function (req, res) {


	if (req.session.sessionid) {
		res.redirect('/dashboard');
	} else {
		res.render('index')
		// res.sendFile(viewspath + "index.html");
	}
});


router.get("/dashboard", async (req, res, next) => {
	sess = req.session;
	console.log({ sess })
	if (req.session.sessionid) {
		console.log(sess.access_token)
		const getData = await consentList(req, res, sess.access_token)
		console.log({getData})
		try {
			if (typeof getData !== 'undefined') {
				itemCount = getData.resultcount
				var pageCount;
				var page_no, limit;
				limit = 5
				var appname = req.query.appname
				if (!appname) appname = ''
				itemCount = getData.resultcount
				if (itemCount == 0) {
					pageCount = 0;
				} else {
					pageCount = Math.ceil(itemCount / 5);
				}
				if (!getData.page) { page_no = 0 } else { page_no = parseInt(getData.page) }
				var currentPage = page_no + 1
				res.render('dashboard', {
					apps: getData.apps,
					pageCount,
					itemCount,
					currentPage,
					limit,
					appname,
					pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
				});
			} else {
				res.render('badrequest')
			}
		} catch (err) {
			next(err);
		}
	}
	else {
		res.redirect('/logout');
	}
});

router.get("/logout", function (req, res) {
	req.session.destroy(function (err) {
		if (err) {
			console.log(err);
		} else {
			res.redirect('/');
		}
	});
});

router.get('/api/validateMobileNo', function (req, res) {
	phone_no = req.query.phone_no
	var number = subscriberUtil.getTelco(phone_no)
	res_data = {}
	if (!number.valid || number.telco !== 'globe') {
		res_data.error_code = "InvalidPhoneNo"
		res_data.error_message = 'Invalid Phone No.'
		res.statusCode = 400
		res.send(res_data);
	} else {
		res.statusCode = 200
		res.send(res_data);
	}
});





module.exports = router;