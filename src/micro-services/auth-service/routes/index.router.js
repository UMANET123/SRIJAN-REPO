/*jshint esversion: 8 */
const express = require("express");
// const sequelize = require('../config/orm.database');
// const {
//   SubscriberDataMask,
//   SubscriberOTP,
//   FloodControl
// } = require("../config/models");
let router = express.Router();
// const generateHotpController = require("../controllers/generate-hotp.controller");
const generateTotpController = require("../controllers/generate-totp.controller");
// const verifyHotpController = require("../controllers/verify-hotp.controller");
const verifyTotpController = require("../controllers/verify-totp.controller");
const verifyUserController = require("../controllers/verify-user.controller");
const invalidateTransaction = require("../controllers/invalidate-transaction.controller");
const createTransaction = require("../controllers/create-transaction.controller");
const getTransaction = require("../controllers/get-transaction.controller");
const updateTransaction = require("../controllers/update-transaction.controller.js");

// router.post(`/generate/hotp`, generateHotpController);
router.post(`/generate/totp`, generateTotpController);
// router.post(`/verify/hotp`, verifyHotpController);
router.post(`/verify/totp`, verifyTotpController);
router.post(`/verify/user`, verifyUserController);

//  transaction routes
router.post("/transaction", createTransaction);
router.put("/transaction/:transaction_id", updateTransaction);
router.patch("/transaction/:transaction_id", updateTransaction);
router.get("/transaction/:transaction_id", getTransaction);
router.put(`/transaction/:transaction_id/invalidate`, invalidateTransaction);
module.exports = router;
