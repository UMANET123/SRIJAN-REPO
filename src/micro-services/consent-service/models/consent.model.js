/* jshint esversion:6 */
require("dotenv").config();
const axios = require("axios");
const { createAppMetaData } = require("./_util.model");
const pool = require("../config/db");
const { SubscriberConsent } = require("../config/models");
/**
 *
 *
 * @param {*} args Arguements
 * - reqBody
 *  - {string} subscriber_id Subscriber Id
 *  - {string} transaction_id Transaction Id
 *  - {string} access_token Access Token
 *  - {string} app_id App Id
 *  - {string} developer_id Developer Id
 *  - {[]} scopes Scopes
 *  - {string} appname App Name
 *
 * - {function} callback Callback Function
 * Create a Consent,
 * Cases
 *  - If record exist with same subscriber_id, app_id, developer_id
 *   - check scopes are same
 *    - if true return
 *    - else update consent
 *  - else create a consent alongwith app metadata
 *
 */
function createConsent(...args) {
  let createdDate = new Date();
  let [reqBody, callback] = args;
  let {
    subscriber_id,
    transaction_id,
    access_token,
    app_id,
    developer_id,
    scopes,
    appname
  } = reqBody;
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
            { app_id, developer_id, appname, createdDate },
            isAppMetaCreated => {
              return callback(201, {
                old_token: false,
                old_token_value: ""
              });
            }
          );
          //  return
        });
      }
    });

    // (async () => {
    //   validateRedirectTxn({ subscriber_id, transaction_id, app_id, callback });
    //   const client = await pool.connect();
    //   try {
    //     //  create a record entry for subscriber consent
    //     let consent_table = `subscriber_consent`;
    //     let record = await client.query(
    //       `select * from ${consent_table} where uuid=($1) and app_id=($2) and developer_id=($3)`,
    //       [subscriber_id, app_id, developer_id]
    //     );

    //     //  check record exists
    //     if (record.rows[0]) {
    //       let scopeFound = record.rows[0].scopes;
    //       if (JSON.stringify(scopeFound) == JSON.stringify(scopes)) {
    //         // console.log("code passing");
    //         return callback(302, { status: "Record already Exists!" });
    //       } else {
    //         await client.query(
    //           `UPDATE ${consent_table} SET scopes=($1), updated=($2) WHERE  uuid=($3) and app_id=($4) and developer_id=($5)`,
    //           [
    //             JSON.stringify(scopes),
    //             createdDate,
    //             subscriber_id,
    //             app_id,
    //             developer_id
    //           ]
    //         );
    //         callback(200, {
    //           old_token: false,
    //           old_token_value: ""
    //         });
    //       }
    //     } else {
    //       // create a consent
    //       await client.query(
    //         `INSERT INTO ${consent_table}(uuid, app_id, developer_id, scopes, access_token, created, status) values ($1, $2, $3, $4, $5, $6, $7)`,
    //         [
    //           subscriber_id,
    //           app_id,
    //           developer_id,
    //           JSON.stringify(scopes),
    //           access_token,
    //           createdDate,
    //           1
    //         ]
    //       );
    //     }
    //     //  create a record entry for app meta data

    //   } finally {
    //     client.release();
    //   }
    // })().catch(e => {
    //   console.log(e.stack);
    //   throw e;
    // });
  });
}

function updateConsent(...args) {
  let [reqBody, callback] = args;
  let {
    subscriber_id,
    transaction_id,
    access_token,
    app_id,
    developer_id,
    scopes,
    appname
  } = reqBody;
  //  create transaction
  (async () => {
    // check transaction id Exists
    if (transaction_id)
      validateRedirectTxn({ subscriber_id, transaction_id, app_id, callback });
    const client = await pool.connect();
    try {
      let table = `subscriber_consent`;
      let record = await client.query(
        `UPDATE ${table} SET scopes=($1), access_token=($2), status=($7), updated=($3) WHERE uuid=($4) and app_id=($5) and developer_id=($6)  RETURNING (SELECT access_token FROM ${table} WHERE uuid=($4) and app_id=($5) and developer_id=($6) limit 1)`,
        [
          JSON.stringify(scopes),
          access_token,
          new Date(),
          subscriber_id,
          app_id,
          developer_id,
          0
        ]
      );
      if (record.rows[0]) {
        console.log("consent updated");
        let invalidateTxnUrl = `${
          process.env.AUTH_SERVICE_BASEPATH
        }/transaction/${transaction_id}/invalidate`;
        //   invalidate transaction after setting access token
        let invalidateTxn = await axios.put(invalidateTxnUrl, {
          subscriber_id,
          app_id
        });
        console.log({ status: invalidateTxn.status });
        let accessToken = record.rows[0].access_token;
        if (accessToken) {
          return callback(200, {
            old_token: true,
            old_token_value: accessToken
          });
        } else {
          return callback(200, { old_token: false, old_token_value: "" });
        }
      } else {
        return callback(400, {
          error_code: "BadRequest",
          error_message: "Bad Request"
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
function isTransactionValid(subscriber_id, transaction_id, app_id, callback) {
  let txnValidityUrl = `${
    process.env.AUTH_SERVICE_BASEPATH
  }/transaction/${transaction_id}/${subscriber_id}/${app_id}`;
  // check transaction id Exists
  axios
    .get(txnValidityUrl)
    .then(txn => callback(txn.data.is_valid))
    .catch(e => console.log(e));
  // console.log({ txnValid: txnData.data.is_valid });
  // if (!txnData.data.is_valid) {
  //   return callback(403, { status: "Transaction id is not valid" });
  // }
}

module.exports = { createConsent, updateConsent, getConsentList };
