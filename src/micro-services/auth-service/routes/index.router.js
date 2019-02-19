const express = require('express');
const {BASE_PATH} = require('../config/environment');

let router = express.Router();
const generateHotpController = require('../controllers/generate-hotp.controller');
const generateTotpController = require('../controllers/generate-totp.controller');
const verifyHotpController = require('../controllers/verify-hotp.controller');
const verifyTotpController = require('../controllers/verify-topt.controller');
const verifyUserController = require('../controllers/verify-user.controller');
const validateTransaction = require('../controllers/validate-transaction.controller');


router.post(`${BASE_PATH}/generate/hotp`, generateHotpController);
router.post(`${BASE_PATH}/generate/totp`, generateTotpController);
router.post(`${BASE_PATH}/verify/hotp`, verifyHotpController);
router.post(`${BASE_PATH}/verify/totp`, verifyTotpController);
router.post(`${BASE_PATH}/verify/user`, verifyUserController);

router.get(`${BASE_PATH}/transaction/:transaction_id/:subscriber_id/:app_id`, validateTransaction);


module.exports = router;