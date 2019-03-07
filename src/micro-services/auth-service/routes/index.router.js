const express = require("express");
// const sequelize = require('../config/orm.database');
const {
  SubscriberDataMask,
  SubscriberOTP,
  FloodControl
} = require("../config/models");
let router = express.Router();
const generateHotpController = require("../controllers/generate-hotp.controller");
const generateTotpController = require("../controllers/generate-totp.controller");
const verifyHotpController = require("../controllers/verify-hotp.controller");
const verifyTotpController = require("../controllers/verify-topt.controller");
const verifyUserController = require("../controllers/verify-user.controller");
const validateTransaction = require("../controllers/validate-transaction.controller");
const invalidateTransaction = require("../controllers/invalidate-transaction.controller");

router.post(`/generate/hotp`, generateHotpController);
router.post(`/generate/totp`, generateTotpController);
router.post(`/verify/hotp`, verifyHotpController);
router.post(`/verify/totp`, verifyTotpController);
router.post(`/verify/user`, verifyUserController);

router.get("/test/orm/", (req, res) => {
  // SubscriberDataMask.create({valye})
  // SubscriberDataMask.findAll().then(result => {
  //   console.log(result.length);
  // });

  // SubscriberOTP.findAll().then(result => console.log(result.length));
  SubscriberOTP.create({
    uuid: "sdsdsdr4grgdfdfdfdf",
    app_id: "343ddsddfsfdfd",
    otp: 343232,
    expiration: new Date(),
    status: 0
  })
    .then(otpRecord => {
      console.log({ otpRecord });
    })
    .catch(err => console.log(err));
  // FloodControl.findAll().then(result => console.log(result.length));
  // FloodControl.findOrCreate({
  //   where: { uuid: "890a4001ef92d2326ead83413b7xxx43b" },
  //   attributes: ["status", "created_at"]
  // })
  //   .spread((flowControl, created) =>
  //     console.log(flowControl.get("status"), created)
  //   )
  //   .catch(err => console.log(err));
  res.status(200).send({
    message: "hello"
  });
});

router.get(
  `/transaction/:transaction_id/:subscriber_id/:app_id`,
  validateTransaction
);
router.put(`/transaction/:transaction_id/invalidate`, invalidateTransaction);

module.exports = router;
