const express = require('express')
let router = express.Router();
const paginate = require('express-paginate');

var subscriberUtil = require('../utility/subscriber');
const generateTotpController = require('../controllers/generate-otp.controller');
const verifyTotpController = require('../controllers/verify-otp.controller');
const updateConsentController = require('../controllers/update-consent.controller');

var sess;
router.get("/", function (req, res) {
	sess = req.session;

	if (sess.sessionid) {
		res.redirect('/dashboard');
	} else {
		res.render('index')
		// res.sendFile(viewspath + "index.html");
	}
});

router.get("/dashboard", async (req, res, next) => {
	sess = req.session;
	//	if (sess.sessionid ){
	var mode_data = {
		"page": 0,
		"limit": 10,
		"resultcount": 12,
		"apps": [
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Subscriber-Authentication",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION", "SMS"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Subscriber-Authentication",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Wather ",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION", "SMS"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Office",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Abc",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION", "SMS"
				]
			}
			, {
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Subscriber-Authentication",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Subscriber-Authentication",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Subscriber-Authentication",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Subscriber-Authentication",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Wather ",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Office",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Abc",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			}
			, {
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Subscriber-Authentication",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			},
			{
				"app_id": "7d3c0649-4ae3-4d02-8224-9ac9ccf2ca21",
				"appname": "Subscriber-Authentication",
				"developer_id": "aswin.segu",
				"scopes": [
					"LOCATION"
				]
			}
		]
	}
	//	console.log(mode_data)
	results = mode_data
	itemCount = 12
	try {

		//	https://api.myjson.com/bins/1d1nea

		const pageCount = Math.ceil(itemCount / 3);


		// if (res.query.page) {
		// 	const currentPage = res.query.page + 1
		// } else {
		// 	const currentPage = mode_data.page + 1
		// }
		const currentPage = mode_data.page + 1
		res.render('dashboard', {
			apps: results.apps,
			pageCount,
			itemCount,
			currentPage,
			pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
		});
		// if (req.accepts('json')) {
		// 	// inspired by Stripe's API response for list objects
		// 	res.json({
		// 		object: 'list',
		// 		has_more: paginate.hasNextPages(req)(pageCount),
		// 		data: results
		// 	});
		// } else {
		// 	res.render('dashboard', {
		// 		users: results,
		// 		pageCount,
		// 		itemCount,
		// 		pages: paginate.getArrayPages(req)(3, pageCount, req.query.page)
		// 	});
		//}

	} catch (err) {
		//	next(err);
	}


	//	} else {
	//		res.redirect('/logout');
	//	}
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
router.post('/api/generate/otp', generateTotpController);
router.post('/api/verify/otp', verifyTotpController);
router.post('/api/consent', updateConsentController)
// router.post('/verify/hotp', verifyHotpController);

// router.post('/verify/user', verifyUserController);
module.exports = router;