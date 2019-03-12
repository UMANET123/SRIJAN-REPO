/*jshint esversion: 6 */
require("dotenv").config();
const crypto = require("crypto");
const otplib = require("otplib");
const axios = require("axios");
const {
  OTP_SETTINGS: { timer, step }
} = require("../config/environment");
const { verifyUser } = require("./auth.model");
 /**
  * This function will generate an OTP using a secret
  * @param {string} secret Secret Hash String
  * @returns {number} 6 digit OTP number
  */
function getNewOtp(secret) {
  return otplib.authenticator.generate(secret);
}

 /**
  * Takes a key in and generates a string hash
  * @param {number} key Unqiue key to generate a Hash
  * @returns {string} Hash String
  */
function getNewSecret(key) {
  return crypto
    .createHash("md5")
    .update(key)
    .digest("hex");
}

/**
 * Updates OTP Configurations of the lib
 */
function configureOTP() {
  otplib.totp.options = {
    step: step,
    window: timer
  };
}

/**
 * Checks if a user app is blacklisted
 * @param {string} msisdn Mobile Number
 * @param {string} app_id App ID
 * @param {Function} callback 
 * @returns {Function} returns callback with boolean value
 */
function checkBlackListApp(msisdn, app_id, callback) {
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
  configureOTP,
  checkBlackListApp
};
