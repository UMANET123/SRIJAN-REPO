const express = require('express');
let router = express.Router();
const createConsent = require('../controllers/create-consent.controller');
const updateConsent = require('../controllers/update-consent.controller');
const checkBlackList = require('../controllers/check-blacklist.controller');
router.post(`/consent`, createConsent);
router.put(`/consent`, updateConsent);
router.get(`blacklist/:subscriber_id/:app_id`, checkBlackList);
module.exports = router;