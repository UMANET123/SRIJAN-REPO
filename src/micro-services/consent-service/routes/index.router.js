const express = require('express');
let router = express.Router();
const createConsent = require('../controllers/create-consent.controller');
const updateConsent = require('../controllers/update-consent.controller');

router.post(`/consent`, createConsent);
router.put(`/consent`, updateConsent);
module.exports = router;