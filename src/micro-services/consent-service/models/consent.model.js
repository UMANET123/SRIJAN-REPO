/* jshint esversion:6 */
require("dotenv").config();
const axios = require("axios");
const logger = require("../logger");
const { createAppMetaData } = require("./_util.model");
const { SubscriberConsent } = require("../config/models");
const sequelize = require("../config/orm.database");
const arraysHaveSameItems = require("../helpers/compare-arrays.helper");

/**
 *
 *
 * @param {string} subscriber_id Subscriber Id
 * @param {string} access_token Access Token
 * @param {string} app_id App Id
 * @param {string} developer_id Developer Id
 * @param {[]} scopes Scopes
 * @param {string} appname App Name
 * @param {string} consent_expiry Expiry date in ISO format
 * @param {string} consent_type Expiry type, ENUM [NO_EXPIRY, FIXED_EXPIRY, EVERYTIME_EXPIRY]
 * @param {function} callback Callback Function
 * Create a Consent,
 * Cases
 *  - If record exist with same subscriber_id, app_id, developer_id
 *   - check scopes are same
 *    - if true return
 *    - else update consent
 *  - else create a consent alongwith app metadata
 *
 */
function createConsent(
  subscriber_id,
  app_id,
  developer_id,
  scopes,
  appname,
  access_token,
  consent_expiry,
  consent_type,
  callback
) {
  let createdDate = new Date();
  //  find Existing consent ...
  return SubscriberConsent.findOne({
    where: { uuid: subscriber_id, app_id, developer_id },
    attributes: ["app_id", "scopes"]
  })
    .then(consent => {
      if (consent && consent.app_id) {
        //  consent is found
        //  and check scopes are same return response

        if (arraysHaveSameItems(scopes, consent.scopes)) {
          //  record exists
          return callback(302, { status: "Record already Exists!" });
        } else {
          //  if not update consent else return
          SubscriberConsent.update(
            {
              scopes,
              updated: createdDate
            },
            {
              returning: true,
              where: { uuid: subscriber_id, app_id, developer_id }
            }
          )
            .then(updatedConsent => {
              //  get updated Record
              let [affectedRows, consent] = updatedConsent;
              //  get access token from consent
              let { access_token } = consent[0].dataValues;
              //  return response
              if (access_token) {
                return callback(200, {
                  old_token: true,
                  old_token_value: access_token
                });
              } else {
                return callback(200, {
                  old_token: false,
                  old_token_value: ""
                });
              }
            })
            .catch(() => {
              logger.log(
                "error",
                "ConsentModel:CreateConsent:SubscriberConsent.update:",
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
      } else {
        //  Need to create new consent
        SubscriberConsent.create({
          uuid: subscriber_id,
          app_id,
          developer_id,
          scopes,
          access_token,
          created: createdDate,
          status: 1,
          consent_expiry: consent_expiry,
          consent_type: consent_type
        })
          .then((data) => {
            //  consent record is created
            //  create metadata
            createAppMetaData(
              app_id,
              developer_id,
              appname,
              createdDate,
              consent_expiry,
              isAppMetaCreated => {
                //  500 internal server error
                if (isAppMetaCreated == 500) {
                  logger.log(
                    "error",
                    "ConsentModel:CreateConsent:CreateAppMetaData.create:",
                    {
                      message: "Internal Server Error"
                    }
                  );
                  return callback(500, {
                    error_code: "InternalServerError",
                    error_message: "Internal Server Error"
                  });
                }
                return callback(201, {
                  old_token: false,
                  old_token_value: ""
                });
              }
            );
          })
          .catch(() => {
            logger.log(
              "error",
              "ConsentModel:CreateConsent:SubscriberConsent.create:",
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
    })
    .catch(() => {
      logger.log(
        "error",
        "ConsentModel:CreateConsent:SubscriberConsent.findOne:",
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
 * @param {string} access_token Access Token
 * @param {string} app_id App ID
 * @param {string} developer_id Developer Id
 * @param {[]} scopes Scopes Array
 * @param {string} appname App Name
 * @param {function} callback Callback Function
 *
 * Update consent with returing access token in callback
 */

function updateConsent(
  subscriber_id,
  access_token,
  app_id,
  developer_id,
  scopes,
  appname,
  consent_expiry,
  consent_type,
  callback
) {
  //  update query to run
  let queryToRun = `UPDATE subscriber_consent SET scopes= :scopes, access_token= :access_token, status= :status, updated= :updated WHERE uuid= :uuid and app_id= :app_id and developer_id= :developer_id  RETURNING (SELECT access_token FROM subscriber_consent WHERE uuid= :uuid and app_id= :app_id and developer_id= :developer_id limit 1)`;
  //  query values as object
  let replacements = {
    scopes: JSON.stringify(scopes),
    access_token,
    status: 0,
    updated: new Date(),
    uuid: subscriber_id,
    app_id,
    developer_id
  };
  // update consent
  sequelize
    .query(queryToRun, { replacements, type: sequelize.QueryTypes.UPDATE })
    .then(consent => {
      let [tokenRecord, updated] = consent;
      //  get old token from query response
      if (tokenRecord[0].hasOwnProperty("access_token")) {
        if (tokenRecord[0].access_token) {
          // valid access token
          return callback(200, {
            old_token: true,
            old_token_value: tokenRecord[0].access_token
          });
        } else {
          //  invalid value as null/falsy value
          return callback(200, {
            old_token: false,
            old_token_value: ""
          });
        }
      } else {
        return callback(403, { status: "Forbidden" });
      }
    })
    .catch(() => {
      logger.log(
        "error",
        "ConsentModel:UpdateConsent:SubscriberConsent.update:",
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
 * @param {number} [limit=10] Limit  Number of Items default value 10
 * @param {number} [page=0]  Page Page of Pagination default value 0
 * @param {string} [appname=null] Appname default value null
 * @param {string} order Order For Date Filter
 * @param {function} callback Callback Function
 * @returns {callback} callback Callback Function
 *
 * It queries for Consent and returns consents with pagination
 * in the callback function
 */
function getConsentList(
  subscriber_id,
  limit = 10,
  page = 0,
  appname = null,
  order,
  callback
) {
  //  callculate offset
  let offset = page * limit;
  //  without appname query string , replacements object
  //  update query to run
  let filterWithApp = ``;
  //  query values as object
  let queryData = {
    uuid: subscriber_id,
    status: 0,
    limit,
    offset
  };
  if (appname) {
    //  add where clause  appnme filter
    filterWithApp = `and appname ILIKE :appname`;
    //  add appname in the query object
    queryData.appname = `%${appname}%`;
  }
  //  query find appname, details from subscriber_consent and apps_metadata
  let queryToRun = `SELECT consent.app_id, appname, consent.developer_id, scopes, count(*) OVER() AS total_rows FROM subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid= :uuid ${filterWithApp} and status= :status and scopes IS NOT NULL 
  order by consent.created ${order} LIMIT :limit OFFSET :offset`;

  // execute query with data
  sequelize
    .query(queryToRun, {
      replacements: queryData,
      type: sequelize.QueryTypes.SELECT
    })
    .then(consents => {
      //  consents array is not empty
      if (consents.length > 0) {
        //  get total rows
        let totalRows = consents[0].total_rows;
        // remove `total_rows` from consents object
        let apps = consents.filter(consent => delete consent.total_rows);
        //  return response
        return callback(200, {
          page,
          limit,
          resultcount: totalRows,
          apps
        });
      } else {
        //  return empty array, for empty response
        return callback(200, {
          resultcount: 0,
          apps: []
        });
      }
    })
    .catch(() => {
      logger.log("error", "ConsentModel:GetConsentList:Conset.Select:", {
        message: "Internal Server Error"
      });
      return callback(500, {
        error_code: "InternalServerError",
        error_message: "Internal Server Error"
      });
    });
}

module.exports = { createConsent, updateConsent, getConsentList };
