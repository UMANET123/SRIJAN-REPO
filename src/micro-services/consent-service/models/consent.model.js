/* jshint esversion:6 */
require("dotenv").config();
const axios = require("axios");
const { createAppMetaData } = require("./_util.model");
const pool = require("../config/db");
const { SubscriberConsent } = require("../config/models");
const sequelize = require("../config/orm.database");
/**
 *
 *
 * @param {string} subscriber_id Subscriber Id
 * @param {string} transaction_id Transaction Id
 * @param {string} access_token Access Token
 * @param {string} app_id App Id
 * @param {string} developer_id Developer Id
 * @param {[]} scopes Scopes
 * @param {string} appname App Name
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
  transaction_id,
  app_id,
  developer_id,
  scopes,
  appname,
  access_token,
  callback
) {
  let createdDate = new Date();
  // check isTransaction Valid
  isTransactionValid(subscriber_id, transaction_id, app_id, isTxnValid => {
    //  transaction is not valid
    console.log(isTxnValid);
    if (!isTxnValid) {
      return callback(403, { status: "Transaction id is not valid" });
    }
    //  find Existing consent ...
    SubscriberConsent.findOne({
      where: { uuid: subscriber_id, app_id, developer_id },
      attributes: ["app_id", "scopes"]
    }).then(consent => {
      if (consent && consent.app_id) {
        //  consent is found
        //  and check scopes are same return response
        if (JSON.stringify(scopes) == JSON.stringify(consent.scopes)) {
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
            .catch(err => console.log(err));
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
          status: 1
        }).then(() => {
          //  consent record is created
          //  create metadata
          createAppMetaData(
            app_id,
            developer_id,
            appname,
            createdDate,
            isAppMetaCreated => {
              return callback(201, {
                old_token: false,
                old_token_value: ""
              });
            }
          );
        });
      }
    });
  });
}

/**
 *
 *
 * @param {string} subscriber_id Subscriber Id
 * @param {string} transaction_id Transaction Id
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
  transaction_id,
  access_token,
  app_id,
  developer_id,
  scopes,
  appname,
  callback
) {
  //  check transaction is valid then proceed
  isTransactionValid(subscriber_id, transaction_id, app_id, isTxnValid => {
    //  transaction is not valid
    if (!isTxnValid) {
      return callback(403, { status: "Transaction id is not valid" });
    }
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
        //  invalidate tranaction endpoint
        let invalidateTxnUrl = `${
          process.env.AUTH_SERVICE_BASEPATH
        }/transaction/${transaction_id}/invalidate`;
        // invoke  invalidate transaction after setting access token
        axios
          .put(invalidateTxnUrl, {
            subscriber_id,
            app_id
          })
          .then(() => {
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
          .catch(e => console.log(e));
      })
      .catch(e => console.log(e));
  });
}

function getConsentList(
  subscriber_id,
  limit = 10,
  page = 0,
  appname = null,
  callback
) {
  //  create transaction
  (async () => {
    const client = await pool.connect();
    try {
      let offset = page * limit;
      let record = null;
      let totalRecords = null;
      if (appname) {
        // Total Records
        totalRecords = await client.query(
          `SELECT consent.app_id, appname, consent.developer_id, scopes FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid=($1) 
             and appname like ($2) and status=($3) and scopes IS NOT NULL`,
          [subscriber_id, "%" + appname + "%", 0]
        );

        //  get consent app list query by appname
        record = await client.query(
          `SELECT consent.app_id, appname, consent.developer_id, scopes FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid=($1) 
            and appname like ($2) and status=($3) and scopes IS NOT NULL LIMIT ($4) OFFSET ($5)`,
          [subscriber_id, "%" + appname + "%", 0, limit, offset]
        );
      } else {
        totalRecords = await client.query(
          `SELECT consent.app_id, appname, consent.developer_id, scopes FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid=($1) 
             and status=($2) and scopes IS NOT NULL`,
          [subscriber_id, 0]
        );

        //  get consent app list query without appname
        record = await client.query(
          `SELECT consent.app_id, appname, consent.developer_id, scopes FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid=($1) 
            and status=($2) and scopes IS NOT NULL LIMIT ($3) OFFSET ($4)`,
          [subscriber_id, 0, limit, offset]
        );
      }
      if (record.rows[0]) {
        return callback(200, {
          page,
          limit,
          resultcount: totalRecords.rows.length,
          apps: record.rows
        });
      } else {
        return callback(200, {
          resultcount: 0,
          apps: []
        });
      }
    } finally {
      client.release();
    }
  })().catch(e => {
    console.log(e.stack);
    throw e;
  });
}
//  validate transaction
/**
 *
 *
 * @param {string} subscriber_id
 * @param {string} transaction_id
 * @param {string} app_id
 * @param {function} callback
 */
function isTransactionValid(subscriber_id, transaction_id, app_id, callback) {
  let txnValidityUrl = `${
    process.env.AUTH_SERVICE_BASEPATH
  }/transaction/${transaction_id}/${subscriber_id}/${app_id}`;
  // check transaction id Exists
  axios
    .get(txnValidityUrl)
    .then(txn => callback(txn.data.is_valid))
    .catch(e => console.log(e));
}

module.exports = { createConsent, updateConsent, getConsentList };
