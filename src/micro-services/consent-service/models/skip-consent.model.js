const { SubscriberConsent } = require("../config/models");
const logger = require('../logger');
function skipConsent(params, callback) {
  let { uuid, app_id } = params;
  // scopes = JSON.parse(scopes).sort();
  SubscriberConsent.findOne({
    where: {
      uuid: uuid,
      app_id: app_id
    },
    attributes: [
      "uuid",
      "app_id",
      "developer_id",
      "access_token",
      "scopes",
      "status"
    ]
  })
    .then(result => {
      if (result) {
        // retrivedScopes = result.scopes.sort();
        // console.log(retrivedScopes)
        // if (retrivedScopes.length == scopes.length) {
        //   for (var i = 0; i < scopes.length; i++) {
        //     if (scopes[i] != retrivedScopes[i]) {
        //       return callback(false, 200);
        //     }
        //   }
        //   return callback(true, 200);
        // } else {
        //   return callback(false, 200);
        // }
        console.log(result);
        if (
          result.access_token != null &&
          result.scopes != null &&
          result.status == 0
        ) {
          return callback({ status: true, scopes: result.scopes }, 200);
        } else {
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
