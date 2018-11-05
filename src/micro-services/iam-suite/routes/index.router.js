const express = require('express')
let router = express.Router();
const loginController = require('../controllers/onboarding/login.controller');
const registrationController = require('../controllers/onboarding/registration.controller');
const verificationController = require('../controllers/onboarding/verification.controller');
const resendController = require('../controllers/onboarding/resend.controller');
const bypassController = require('../controllers/bypass/bypass.controller');
const demoController = require('../controllers/demo/demo.controller');
const oauthConsentController = require('../controllers/demo/oauth-consent.controller');
const oauthLoginController = require('../controllers/demo/oauth-login.controller');
const resetPasswordController = require('../controllers/onboarding/reset-password.controller');
const changePasswordController = require('../controllers/onboarding/change-password.controller');
const validationController = require('../controllers/onboarding/validation.controller');

router.post('/login', loginController.post);
router.post('/register', registrationController.post);
router.get('/verify/:hash', verificationController.get);
router.post('/resend', resendController.post);
router.post('/status', bypassController.post);
router.get('/oauth/v2/login', oauthLoginController.get);
router.get('/oauth/v2/consent', oauthConsentController.get);
router.put('/reset_password', resetPasswordController.put);
router.put('/change_password', changePasswordController.put);
router.get('/validate', validationController.get);
router.get('/', demoController.get);

module.exports = router;