const express = require('express')
let router = express.Router();
const loginController = require('../controllers/login/login.controller');
const registrationController = require('../controllers/registration/registration.controller');
const verificationController = require('../controllers/verification/verification.controller');
const resendController = require('../controllers/resend/resend.controller');
router.post('/login', loginController.post);
router.post('/register', registrationController.post);
router.get('/verify/:hash', verificationController.get);
router.post('/resend', resendController.post);

module.exports = router;