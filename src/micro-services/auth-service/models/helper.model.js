/*jshint esversion: 6 */
require("dotenv").config();
const crypto = require("crypto");
const otplib = require("otplib");
const axios = require("axios");
const {
  OTP_SETTINGS: { timer, step }
} = require("../config/environment");
const { verifyUser } = require("./auth.model");
const pool = require("../config/db");
const addMinToDate = require("../helpers/add-minute-to-date");
//  create new otp
function getNewOtp(secret) {
  return otplib.authenticator.generate(secret);
}
// create new secret
function getNewSecret(msisdn) {
  return crypto
    .createHash("md5")
    .update(msisdn)
    .digest("hex");
}

/**
 * Todo
 * - Better naming convention
 */
function setOtpSettings() {
  otplib.totp.options = {
    step: step,
    window: timer
  };
}

//  check app-subsubser blacklisted
function checkBlackListApp({ msisdn, app_id }, callback) {
  let consent_base_url = process.env.CONSENT_SERVICE_BASEPATH;
  // get uuid from phone
  verifyUser(msisdn, null, response => {
    if (response && response.subscriber_id) {
      //  do a query to check blacklist api with uuid and msisdn
      let reqUrl = `${consent_base_url}/blacklist/${
        response.subscriber_id
      }/${app_id}`;
      axios
        .get(reqUrl)
        .then(({ data }) => {
          if (data) {
            return callback(true);
          }
          return callback(false);
        })
        .catch(function(error) {
          console.log(error);
        });
    }
    return callback(false);
  });
}

module.exports = {
  getNewOtp,
  getNewSecret,
  setOtpSettings,
  checkBlackListApp
};
