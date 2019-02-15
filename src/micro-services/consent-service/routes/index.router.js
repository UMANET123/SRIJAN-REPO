const express = require('express');
let router = express.Router();
const createConsent = require('../controllers/create-consent.controller');
const updateConsent = require('../controllers/update-consent.controller');
const checkBlackList = require('../controllers/check-blacklist.controller');
const createBlackList = require('../controllers/create-blacklist.controller');
const revokeSingle= require('../controllers/revoke-app-consent.controller');
const revokeAll= require('../controllers/revoke-all-app-consent.controller');
const consentList = require('../controllers/consent-app-list.controller');

router.post(`/consent`, createConsent);
router.put(`/consent`, updateConsent);
router.get(`/blacklist/:subscriber_id/:app_id`, checkBlackList);
router.post(`/blacklist`, createBlackList);
router.put(`/revoke/all`, revokeAll);
router.put(`/revoke/:subscriber_id`, revokeSingle);
router.get(`/consent/:subscriber_id/list`, consentList);

module.exports = router;