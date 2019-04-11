/* jshint esversion:6 */

const { SubscriberConsent } = require("../config/models");
const logger = require("../logger");
//  revoke consent for a single record
/**
 *
 *
 * @param {string} subscriber_id Subscriber Id
 * @param {string} app_id App Id
 * @param {string} developer_id Developer Id
 * @param {function} callback Function Callback
 * @returns {function} callback
 *  Revoke Single app return callback with status and revoked token
 *
 */
function revokeSingle(subscriber_id, app_id, developer_id, callback) {
  //  get consent and update scopes to null , status to 1
  return SubscriberConsent.update(
    {
      scopes: null,
      status: 1
    },
    {
      returning: true,
      where: { uuid: subscriber_id, app_id, developer_id, status: 0 }
    }
  )
    .then(updatedConsent => {
      //  get updated Record
      let [affectedRows, consent] = updatedConsent;
      //  get access token from consent
      if (consent[0]) {
        let { access_token } = consent[0].dataValues;
        //  for no access token make request forbidden
        if (!access_token) return callback(403, { status: "Forbidden" });
        // return access token with success response
        return callback(201, { revoked_tokens: [access_token] });
      } else {
        //  no updated record, forbid it
        return callback(403, { status: "Forbidden" });
      }
    })
    .catch(() => {
      logger.log(
        "error",
        "RevokeModel:RevokeSingle:SubscriberConsent.update:",
        {
          message: "Internal Server Error"
        }
      );
      return callback(500, {
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      });
    });
}

/**
 *
 *
 * @param {string} subscriber_id Subscriber Id
 * @param {function} callback Callback Function
 * @returns {callback} Callback Function
 * it revokes all consent record of a subscriber id and
 * returns revoked token in an array
 */
function revokeAll(subscriber_id, callback) {
  //  get consent and update scopes to null , status to 1
  return SubscriberConsent.update(
    {
      scopes: null,
      status: 1
    },
    {
      returning: true,
      where: { uuid: subscriber_id, status: 0 }
    }
  )
    .then(updatedConsents => {
      //  get updated Record
      let [affectedRows, consents] = updatedConsents;
      //  get access token from consent
      //  get all tokens from consents
      let tokenArray = consents.map(({ access_token }) => {
        if (access_token) return access_token;
      });
      if (tokenArray.length > 0) {
        // success  with valid access token
        callback(200, { revoked_tokens: tokenArray });
      } else {
        callback(403, { status: "Forbidden" });
      }
    })
    .catch(() => {
      logger.log("error", "RevokeModel:RevokeAll:SubscriberConsent.update:", {
        message: "Internal Server Error"
      });
      return callback(500, {
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      });
    });
}

module.exports = { revokeSingle, revokeAll };
