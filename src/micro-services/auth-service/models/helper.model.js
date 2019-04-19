/*jshint esversion: 8 */
require("dotenv").config();
const crypto = require("crypto");
const otplib = require("otplib");

const {
  OTP_SETTINGS: { timer, step }
} = require("../config/environment");

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
  getRandomString
};
