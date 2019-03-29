const express = require("express");
let router = express.Router();
const createConsent = require("../controllers/create-consent.controller");
const updateConsent = require("../controllers/update-consent.controller");
const checkBlackList = require("../controllers/check-blacklist.controller");
const createBlackList = require("../controllers/create-blacklist.controller");
const revokeSingle = require("../controllers/revoke-app-consent.controller");
const revokeAll = require("../controllers/revoke-all-app-consent.controller");
const consentList = require("../controllers/get-consent-list.controller");
const getSubscriberApps = require("../controllers/get-subscriber-apps.controller");
const checkskipConsent = require('../controllers/check-consent-bypass.controller');

router.post(`/consent`, createConsent);
router.put(`/consent`, updateConsent);
router.get(`/blacklist/:subscriber_id/:app_id`, checkBlackList);
router.post(`/blacklist`, createBlackList);
router.put(`/revoke/all`, revokeAll);
router.put(`/revoke/:subscriber_id`, revokeSingle);
router.get(`/consent/:subscriber_id/list`, consentList);
router.get(`/app/search/:subscriber_id`, getSubscriberApps);
router.get ('/app/consent_bypass/:uuid/:app_id', checkskipConsent);

module.exports = router;
