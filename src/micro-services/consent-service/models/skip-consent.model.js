const { SubscriberConsent } = require("../config/models");
const logger = require('../logger');
/**
 *
 * Status Codes:  -1, 0, 1
 * -1 = Always Skip
 * 0 = Allow Skip
 * 1 = Always Ask
 */
/**
 * This function will return whether the application can skip consent or not,
 * based on certain factors as follows:
 * -status code
 * -expiry
 * -scopes match or mismatch
 * @param {Object} req
 * @param {Function} callback
 * @returns {callback({status: boolean}, statusCode)}
 * Will return callback with status object and http status code
 */

function skipConsent(req, callback) {
  let { subscriber_id, app_id } = req.params;
  let { scopes } = req.query;
  let returnStatus = false;
  /**
   * Parse Scopes only if they exist
   */
  if (scopes) {
    scopes = JSON.parse(scopes).sort();
  }
  SubscriberConsent.findOne({
    where: {
      uuid: subscriber_id,
      app_id: app_id
    },
    attributes: [
      "uuid",
      "app_id",
      "developer_id",
      "access_token",
      "scopes",
      "status",
      "consent_expiry",
      "consent_type"
    ]
  })
    .then(result => {
      if (result) {
        switch (result.consent_type) {
          case "FIXED_EXPIRY":
            console.log("Fixed Expiry");
            let expiry = Date.parse(result.consent_expiry);
            let today = Date.parse(new Date());
            if (expiry <= today) {
              console.log("Consent Expired");
              return callback({ status: false }, 200);
            }
            //check for scopes
            if (
              result.scopes.length > scopes.length ||
              result.scopes.length == scopes.length
            ) {
              let state = true;
              scopes.map(scope => {
                if (!result.scopes.includes(scope)) {
                  console.log("Consent Mismatch");
                  state = false;
                }
              });
              return callback({ status: state }, 200);
            } else if (result.scopes.length < scopes.length) {
              console.log("Consent present < Consent Recieved");
              return callback({ status: false }, 200);
            }
            //default
            return callback({ status: false }, 200);
          case "NO_EXPIRY":
            console.log("No Expiry");
            if (
              result.scopes.length > scopes.length ||
              result.scopes.length == scopes.length
            ) {
              let state = true;
              scopes.map(scope => {
                if (!result.scopes.includes(scope)) {
                  console.log("Consent Mismatch");
                  state = false;
                }
              });
              return callback({ status: state }, 200);
            } else if (result.scopes.length < scopes.length) {
              console.log("Consent present < Consent Recieved");
              return callback({ status: false }, 200);
            }
            //default
            return callback({ status: false }, 200);
          case "EVERYTIME_EXPIRY":
            console.log("Everytime Expiry");
            return callback({ status: false }, 200);
        }
      } else {
        return callback({ status: false }, 200);
      }
    })
    .catch(e => {
      logger.log(
        "error",
        "SkipConsentModel:SkipConsent:SubscriberConsent.findOne:",
        {
          message: "Internal Server Error"
        }
      );
      return callback({
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      });
    });
}

module.exports = { skipConsent };
