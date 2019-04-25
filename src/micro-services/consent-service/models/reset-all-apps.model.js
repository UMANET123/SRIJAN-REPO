const { AppMetaData, SubscriberConsent } = require("../config/models");
const axios = require("axios");
const { CONSENT_REVOKE_APP_URL } = require("../config/environment");
const logger = require("../logger");

function resetAllApps(auth_header, callback) {
  return AppMetaData.update(
    {
      consent_expiry_local: new Date().toISOString(),
      consent_expiry_global: new Date().toISOString()
    },
    {
      returning: true,
      where: {},
      attributes: ["app_id"]
    }
  )
    .then(data => {
      let result = data[1].map(record => record.dataValues.app_id);
      revokeTokensApigee(result, auth_header);
      callback({ status: true }, 200);
    })
    .catch(error => {
      logger.log(
        "error",
        "ResetAllAppsModel:ResetAllApps:AppMetaData.Update:InternalServerError ",
        {
          message: JSON.stringify({ auth_header })
        }
      );
      logger.log(
        "error",
        "ResetAllAppsModel:ResetAllApps:AppMetaData.Update:InternalServerError ",
        {
          message: `${error}`
        }
      );
      return callback(
        {
          error_code: "InternalServerError",
          error_message: "Internal Server Error"
        },
        500
      );
    });
}

function revokeTokensApigee(app_ids, auth_header) {
  setTimeout(() => {
    app_ids.map(app_id => {
      SubscriberConsent.update({ status: 1 }, { where: { app_id: app_id } })
        .then(() => {
          axios({
            url: `${CONSENT_REVOKE_APP_URL}?app=${app_id}`,
            method: "post",
            headers: {
              Authorization: `Basic ${auth_header}`,
              "Content-Type": "application/x-www-form-urlencoded;charset=utf-8"
            }
          })
            .then(response => {
              console.log(`APP : ${app_id} Tokens was revoked`);
              logger.log(
                "info",
                "ResetAllAppsModel:RevokeTokensApigee:SubscriberBlacklistApp.Update:Success ",
                {
                  message: `${app_id} : Token Was revoked`
                }
              );
            })
            .catch(error => {
              logger.log(
                "error",
                "ResetAllAppsModel:RevokeTokensApigee:SubscriberBlackListApp.Update:InternalServerError ",
                {
                  message: `${app_id} : Token Was NOT revoked`
                }
              );

              logger.log(
                "error",
                "ResetAllAppsModel:RevokeTokensApigee:SubscriberBlackListApp.Update:InternalServerError ",
                {
                  message: error
                }
              );
            });
        })
        .catch(error => {
          logger.log(
            "error",
            "ResetAllAppsModel:RevokeTokensApigee:SubscriberBlackListApp.Update:InternalServerError ",
            {
              message: `${error}`
            }
          );
        });
    });
  }, 100);
}

module.exports = { resetAllApps };
