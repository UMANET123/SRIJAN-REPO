const express = require('express');


let router = express.Router();
const generateHotpController = require('../controllers/generate-hotp.controller');
const generateTotpController = require('../controllers/generate-totp.controller');
const verifyHotpController = require('../controllers/verify-hotp.controller');
const verifyTotpController = require('../controllers/verify-topt.controller');
const verifyUserController = require('../controllers/verify-user.controller');
const validateTransaction = require('../controllers/validate-transaction.controller');


router.post(`/generate/hotp`, generateHotpController);
router.post(`/generate/totp`, generateTotpController);
router.post(`/verify/hotp`, verifyHotpController);
router.post(`/verify/totp`, verifyTotpController);
router.post(`/verify/user`, verifyUserController);

router.get(`/transaction/:transaction_id/:subscriber_id/:app_id`, validateTransaction);


module.exports = router;
