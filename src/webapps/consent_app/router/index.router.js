const express = require("express");
let router = express.Router();

var subscriberUtil = require("../utility/subscriber");
const generateTotpController = require("../controllers/generate-otp.controller");
const verifyTotpController = require("../controllers/verify-otp.controller");
const updateConsentController = require("../controllers/update-consent.controller");

const scopeTexts = require("../utility/scopes-text");

function scopeDescription(scope) {
  scope = scope.toLowerCase().replace(/ /g, "");
  console.log(scope);
  if (scopeTexts[scope]) {
    return scopeTexts[scope];
  }
  return "";
}

router.get("/", function(req, res) {
  sess = req.session;
  console.log(sess);
  if (sess.success_redirect_uri) {
    let success_destination = sess.success_redirect_uri;
    sess.success_redirect_uri = null;
    return res.redirect(302, success_destination);
  }
  if (sess.sessionid) {
    res.redirect("/consent");
  } else {
    var client_id = req.query.client_id;
    if (!client_id) client_id = null;
    console.log(client_id);
    res.render("index", { client_id: client_id });
  }
});
router.get("/consent", function(req, res) {
  sess = req.session;
  if (sess.sessionid && typeof req.query.scope != "undefined") {
    var scope_arr = req.query.scope.split(", ");
    var scopes = scope_arr;
    sess.redirect_uri = req.query.redirect_uri;
    sess.transaction_id = req.query.transaction_id;
    res.render("consent", {
      scopes: scopes,
      redirect_uri: req.query.redirect_uri,
      scopeDescription: scopeDescription
    });
  } else {
    res.redirect("/logout");
  }
});

router.get("/logout", function(req, res) {
  req.session.destroy(function(err) {
    if (err) {
      console.log(err);
    } else {
      res.redirect("/");
    }
  });
});

router.get("/api/validateMobileNo", function(req, res) {
  phone_no = req.query.phone_no;
  var number = subscriberUtil.getTelco(phone_no);
  res_data = {};
  if (!number.valid) {
    res_data.error_code = "InvalidPhoneNo";
    res_data.error_message = "Invalid Phone No.";
    return res.status(400).send(res_data);
  } else {
    return res.status(200).send(res_data);
  }
});
router.post("/api/generate/otp", generateTotpController);
router.post("/api/verify/otp", verifyTotpController);
router.post("/api/consent", updateConsentController);
// router.post('/verify/hotp', verifyHotpController);

// router.post('/verify/user', verifyUserController);
module.exports = router;
