/*jshint esversion: 6 */
require("dotenv").config();
const crypto = require("crypto");
const otplib = require("otplib");
const axios = require("axios");
const {
  CONSENT_KEYS: { consent_client_id, consent_secret_message }
} = require("../config/environment");
const {
  OTP_SETTINGS: { timer, step }
} = require("../config/environment");
const { verifyUser } = require("./auth.model");

const getServiceResolvedUrl = require("../helpers/get-service-resolved-url");
const { getAuthorizationHeader } = require("../helpers/authorization");
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
  serviceHost = process.env.CONSENT_SERVICE_HOST;
  // get uuid from phone
  return getServiceResolvedUrl(`${serviceHost}`)
    .then(url =>
      verifyUser(msisdn, null, response => {
        if (response && response.subscriber_id) {
          //  do a query to check blacklist api with uuid and msisdn
          let reqUrl = `${url}/blacklist/${response.subscriber_id}/${app_id}`;
          return axios
            .get(reqUrl, { headers: {
              'Authorization': getAuthorizationHeader(consent_client_id, consent_secret_message)
              }
            })
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
      })
    )
    .catch(e => console.log(e));
}
/**
 *
 * Get random string
 * @returns {string}  Random String
 */
function getRandomString() {
  return (
    Math.random()
      .toString(36)
      .substring(2, 15) +
    Math.random()
      .toString(36)
      .substring(2, 15)
  );
}

module.exports = {
  getNewOtp,
  getNewSecret,
  configureOTP,
  checkBlackListApp,
  getRandomString
};
