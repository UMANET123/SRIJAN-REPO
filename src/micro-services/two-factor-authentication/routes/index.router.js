const express = require("express");
let router = express.Router();
const generateHotpController = require("../controllers/generate-hotp.controller");
const generateTotpController = require("../controllers/generate-totp.controller");
const verifyHotpController = require("../controllers/verify-hotp.controller");
const verifyTotpController = require("../controllers/verify-totp.controller");

router.post("/generate/hotp", generateHotpController);
router.post("/generate/totp", generateTotpController);
router.post("/verify/hotp", verifyHotpController);
router.post("/verify/totp", verifyTotpController);

module.exports = router;
