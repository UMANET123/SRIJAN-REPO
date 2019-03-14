/* jshint esversion:6 */
const {
  SubscriberBlacklistApp,
  SubscriberConsent
} = require("../config/models");
//  need to remove after modification
// const pool = require("../config/db");
/**
 *
 *
 * @param {Object} { subscriber_id, app_id } Request Object Destructured
 * @param {*} callback Callback Function
 *
 * It will find the app is blacklisted and
 * send response in the callback
 */
function checkBlacklist({ subscriber_id, app_id }, callback) {
  //  find one app with above params
  SubscriberBlacklistApp.findOne({
    where: { uuid: subscriber_id, app_id },
    attributes: ["blacklist_status"]
  })
    .then(blacklist => {
      if (blacklist && typeof blacklist.blacklist_status === "number") {
        // success
        let isBlacklist = blacklist.blacklist_status == 1 ? true : false;
        return callback(200, { is_blacklisted: isBlacklist });
      } else {
        //  not found
        return callback(204, null);
      }
    })
    .catch(e => console.log(e));
}

//  create black list record
/**
 *
 *
 * @param {object} { subscriber_id, app_id, developer_id }
 *  - subscriber_id User/Subscriber Id
 *  - app_id App Id
 *  - developer_id Developer Id
 * @param {*} callback
 * @returns {callback} Callback Function
 *
 * It will find or create Blacklist record and
 * invalidate status of subscriber_consent record
 * return callback along with status code, object
 */
function createBlackList({ subscriber_id, app_id, developer_id }, callback) {
  // find or create BlackList record
  SubscriberBlacklistApp.findOrCreate({
    where: {
      uuid: subscriber_id,
      app_id,
      developer_id,
      blacklist_status: 1,
      status: 0
    },
    attributes: ["uuid"]
  })
    .spread((blacklist, created) => {
      if (created) {
        //  blacklist record is created
        // must update subscriber consent table return token
        SubscriberConsent.update(
          {
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
          .catch(err => console.log(err));
      } else if (blacklist.uuid) {
        //  record found
        return callback(302, { status: "Record already exists!" });
      } else {
        // no record found
        return callback(204, { status: "Record Not Found" });
      }
    })
    .catch(e => {
      console.log(e);
      return;
    });
}

module.exports = { checkBlacklist, createBlackList };
