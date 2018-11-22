const express = require("express");
let router = express.Router();
const loginController = require("../controllers/onboarding/login.controller");
const registrationController = require("../controllers/onboarding/registration.controller");
const verificationController = require("../controllers/onboarding/verification.controller");
const resendController = require("../controllers/onboarding/resend.controller");
const bypassController = require("../controllers/bypass/bypass.controller");
const demoController = require("../controllers/demo/demo.controller");
const oauthConsentController = require("../controllers/demo/oauth-consent.controller");
const oauthLoginController = require("../controllers/demo/oauth-login.controller");
const resetPasswordController = require("../controllers/onboarding/reset-password.controller");
const changePasswordController = require("../controllers/onboarding/change-password.controller");
const validationController = require("../controllers/onboarding/validation.controller");
const twoFactorAuthController = require("../controllers/onboarding/toggle-2fa.controller");
const otpController = require("../controllers/demo/otp.controller");

router.post("/login", loginController.post);
router.post("/register", registrationController.post);
router.post("/resend", resendController.post);
router.post("/status", bypassController.status);
router.post("/bypass/id", bypassController.add);
router.get("/bypass/id/:client_id", bypassController.get);
router.get("/bypass/id", bypassController.getAll);
router.put("/bypass/id", bypassController.update);
router.delete("/bypass/id", bypassController.delete);
router.post("/toggle_2fa", twoFactorAuthController.post);

router.put("/reset_password", resetPasswordController.put);
router.put("/change_password", changePasswordController.put);

router.get("/verify/:hash", verificationController.get);
router.get("/oauth/v2/login", oauthLoginController.get);
router.get("/oauth/v2/consent", oauthConsentController.get);
router.get("/oauth/v2/verify_otp", otpController.get);
router.get("/validate", validationController.get);
router.get("/", demoController.get);

module.exports = router;
