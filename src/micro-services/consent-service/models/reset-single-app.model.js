const { AppMetaData, SubscriberConsent } = require("../config/models");
const axios = require("axios");
const { CONSENT_REVOKE_APP_URL } = require("../config/environment");
const logger = require("../logger");
function resetSingleApp(app_id, auth_header, callback) {
  return AppMetaData.update(
    {
      consent_expiry_local: new Date().toISOString(),
      consent_expiry_global: new Date().toISOString()
    },
    { returning: true, where: { app_id: app_id } }
  )
    .then(data => {
      revokeTokenApigee(app_id, auth_header);
      return callback({ status: true }, 200);
    })
    .catch(error => {
      logger.log(
        "error",
        "ResetSingleAppsModel:ResetingSingleApp:AppMetaData.Update:InternalServerError ",
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

function revokeTokenApigee(app_id, auth_header) {
  setTimeout(() => {
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
            logger.log(
              "info",
              "ResetSingleAppsModel:RevokeTokenApigee:SubscriberConsent.Update:Success ",
              {
                message: `${app_id} Token was reset`
              }
            );
          })
          .catch(error => {
            logger.log(
              "error",
              "ResetSingleAppsModel:RevokeTokenApigee:SubscriberConsent.Update:InternalServerError ",
              {
                message: JSON.stringify({ auth_header, app_id })
              }
            );
            logger.log(
              "error",
              "ResetSingleAppsModel:RevokeTokenApigee:SubscriberConsent.Update:InternalServerError ",
              {
                message: `${error}`
              }
            );
          });
      })
      .catch(error => {
        logger.log(
          "error",
          "ResetAllAppsModel:ResetAllApps:AppMetaData.Update:InternalServerError ",
          {
            message: `${error}`
          }
        );
        logger.log(
          "error",
          "ResetAllAppsModel:ResetAllApps:AppMetaData.Update:InternalServerError ",
          {
            message: JSON.stringify({ app_id, auth_header })
          }
        );
      });
  }, 100);
}

module.exports = { resetSingleApp };
