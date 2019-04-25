const logger = require("../logger");
const { SubscriberConsent, AppMetaData } = require("../config/models");
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
  /**
   * Parse Scopes only if they exist
   */
  if (scopes) {
    scopes = JSON.parse(scopes).sort();
  }
  SubscriberConsent.findOne({
    where: {
      uuid: subscriber_id,
      app_id: app_id,
      status: 0
    },
    attributes: [
      "uuid",
      "app_id",
      "developer_id",
      "access_token",
      "scopes",
      "status",
      "consent_expiry",
      "consent_type",
      "created"
    ]
  })
    .then(result => {
      if (result) {
        AppMetaData.findOne({
          where: { app_id: app_id },
          attributes: ["consent_expiry_local", "consent_expiry_global"]
        }).then(appData => {
          let today = Date.parse(new Date());
          if (appData.consent_expiry_local != null) {
            let app_expiry_local = Date.parse(appData.consent_expiry_local);
            let consent_created = Date.parse(result.created);
            console.log(result.created);
            console.log(consent_created);
            console.log(app_expiry_local);
            if (app_expiry_local > consent_created) {
              logger.log(
                "info",
                "SkipConsentModel:SkipConsent:AppConsentExpired",
                {
                  message: `${app_id} : ${subscriber_id} : Consent Expired Via App`
                }
              );
              return callback({ status: false }, 200);
            }
            logger.log(
              "info",
              "SkipConsentModel:SkipConsent:AppConsentNOTExpired",
              {
                message: `${app_id} : ${subscriber_id} : Consent NOT Expired Via App`
              }
            );
          }

          switch (result.consent_type) {
            case "FIXED_EXPIRY":
              logger.log("info", "SkipConsentModel:SkipConsent:FIXED_EXPIRY", {
                message: `${app_id} : ${subscriber_id} : FIXED_EXPIRY detected`
              });
              let expiry = Date.parse(result.consent_expiry);
              if (expiry <= today) {
                logger.log(
                  "info",
                  "SkipConsentModel:SkipConsent:ConsentExpired",
                  {
                    message: `${app_id} : ${subscriber_id} : Consent Expired Via Expiry Date`
                  }
                );
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
                    logger.log(
                      "info",
                      "SkipConsentModel:SkipConsent:FIXED_EXPIRY",
                      {
                        message: `${app_id} : ${subscriber_id} : Consent Scopes Mismatch`
                      }
                    );
                    state = false;
                  }
                });
                return callback({ status: state }, 200);
              } else if (result.scopes.length < scopes.length) {
                console.log("Consent present < Consent Recieved");
                logger.log(
                  "info",
                  "SkipConsentModel:SkipConsent:FIXED_EXPIRY",
                  {
                    message: `${app_id} : ${subscriber_id} : Consent present < Consent Recieved`
                  }
                );
                return callback({ status: false }, 200);
              }
              //default
              return callback({ status: false }, 200);

            case "NO_EXPIRY":
              logger.log("info", "SkipConsentModel:SkipConsent:NO_EXPIRY", {
                message: `${app_id} : ${subscriber_id} : NO_EXPIRY detected`
              });
              if (
                result.scopes.length > scopes.length ||
                result.scopes.length == scopes.length
              ) {
                let state = true;
                scopes.map(scope => {
                  if (!result.scopes.includes(scope)) {
                    logger.log(
                      "info",
                      "SkipConsentModel:SkipConsent:NO_EXPIRY",
                      {
                        message: `${app_id} : ${subscriber_id} : Consent Scopes Mismatch`
                      }
                    );
                    state = false;
                  }
                });
                return callback({ status: state }, 200);
              } else if (result.scopes.length < scopes.length) {
                logger.log(
                  "info",
                  "SkipConsentModel:SkipConsent:NO_EXPIRY",
                  {
                    message: `${app_id} : ${subscriber_id} : Consent present < Consent Recieved`
                  }
                );
                return callback({ status: false }, 200);
              }
              //default
              return callback({ status: false }, 200);
            case "EVERYTIME_EXPIRY":
              logger.log("info", "SkipConsentModel:SkipConsent:EVERYTIME_EXPIRY", {
                message: `${app_id} : ${subscriber_id} : EVERYTIME_EXPIRY detected`
              });
              return callback({ status: false }, 200);
          }
        });
      } else {
        // Don't skip if the record is not present
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
      logger.log(
        "error",
        "SkipConsentModel:SkipConsent:SubscriberConsent.findOne:",
        {
          message: `${e}`
        }
      );
      return callback({
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      });
    });
}

module.exports = { skipConsent };
