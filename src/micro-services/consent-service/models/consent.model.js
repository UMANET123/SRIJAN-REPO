require('dotenv').config();
const axios = require('axios');
const { createAppMetaData} = require('./_util.model');
const pool = require('../config/db');

function createConsent(...args) {
    let [reqBody, callback] = args;
    let {subscriber_id, transaction_id, access_token, app_id, developer_id, scopes, appname} = reqBody;
    //  create transaction
    (async () => {
            // check transaction id Exists
        let txnValidityUrl =`${process.env.AUTH_SERVICE_BASEPATH}/transaction/${transaction_id}/${subscriber_id}/${app_id}`;

        let txnData = await axios.get(txnValidityUrl);

        if ( !txnData.data.is_valid) {
          return callback(403, {status: "Transaction id is not valid"});
        }
        const client = await pool.connect();
        try {
          //  create a record entry for subscriber consent
          let consent_table =`subscriber_consent`;
          let record =  await client.query(`select * from ${consent_table} where uuid=($1) and app_id=($2) and developer_id=($3)`,[subscriber_id, app_id, developer_id]);
          let createdDate = new Date();
          if ( record.rows[0]) {
            let scopeFound = record.rows[0].scopes;
            if ( JSON.stringify(scopeFound) == JSON.stringify(scopes)) {
              console.log("code passing");
             return callback(302, { "status" : "Record already Exists!"});
            } else {
                  let old_token = await client.query(`UPDATE ${consent_table} SET scopes=($1), updated=($2), status=($6) WHERE  uuid=($3) and app_id=($4) and developer_id=($5)  RETURNING (SELECT access_token FROM ${consent_table} WHERE uuid=($3) and app_id=($4) and developer_id=($5))`, [JSON.stringify(scopes), createdDate, subscriber_id, app_id, developer_id, 0]);
                  if (old_token.rows[0].access_token) {
                    callback(200, {
                      "old_token": true,
                      "old_token_value": old_token.rows[0].access_token
                    });
                  } else {
                    callback(200, {
                      "old_token": false,
                      "old_token_value": ""
                    });
                  }
                 
            }      
          } else {
            await client.query(`INSERT INTO ${consent_table}(uuid, app_id, developer_id, scopes, access_token, created, status) values ($1, $2, $3, $4, $5, $6, $7)`, [subscriber_id, app_id, developer_id, JSON.stringify(scopes), access_token, createdDate, 0]);
          }
          //  create a record entry for app meta data 
          createAppMetaData(callback, app_id, developer_id, appname, createdDate);
         
        } finally {
          client.release();
        }
      })().catch(e => {
          console.log(e.stack);
          throw e;
        });
}

function updateConsent(...args) {
  let [reqBody, callback] = args;
  let {subscriber_id, transaction_id, access_token, app_id, developer_id, scopes, appname} = reqBody;
    //  create transaction
    (async () => {
       const client = await pool.connect();
       try {
           let table=`subscriber_consent`;
           let record = await client.query(`UPDATE ${table} SET scopes=($1), access_token=($2), updated=($3) WHERE uuid=($4) and app_id=($5) and developer_id=($6)  RETURNING (SELECT access_token FROM ${table} WHERE uuid=($4) and app_id=($5) and developer_id=($6))`, [JSON.stringify(scopes),access_token, new Date(), subscriber_id, app_id, developer_id ]);
           if (record.rows[0]) {
              let invalidateTxnUrl =`${process.env.AUTH_SERVICE_BASEPATH}/transaction/${transaction_id}/invalidate`; 
         //   invalidate transaction after setting access token
              await axios.put(invalidateTxnUrl, {
                                                subscriber_id,
                                                app_id
                                              });

             let accessToken = record.rows[0].access_token;
             if (accessToken) {
              return callback(200, {old_token: true,
                old_token_value: accessToken});  
             } else {
              return callback(200, {old_token: false,
                old_token_value: ""}); 
             }
       
           } else {
              return callback(400, {
               "error_code": "BadRequest",
               "error_message": "Bad Request"
             });
           }
               
       } finally {
         client.release();
       }
     })().catch(e => {
         console.log(e.stack)
         throw e;
       });

}

function getConsentList(subscriber_id, limit=10, page=0, appname=null, callback){
//  create transaction
    (async () => {
      const client = await pool.connect();
      try {
          let offset = (page * limit);
          let record = null;
          if (appname) {
            record = await client.query(`SELECT consent.app_id, appname, consent.developer_id, scopes FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid=($1) 
            and appname=($2) and status=($3) and scopes IS NOT NULL LIMIT ($4) OFFSET ($5)`, [subscriber_id, appname, 0, limit, offset]);
          } else {
            record = await client.query(`SELECT consent.app_id, appname, consent.developer_id, scopes FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid=($1) 
            and status=($2) and scopes IS NOT NULL LIMIT ($3) OFFSET ($4)`, [subscriber_id, 0, limit, offset]);
          
          }
          if (record.rows[0]) {
            return callback(200, {
              page,
              limit,
              resultcount: record.rows.length,
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
        console.log(e.stack)
        throw e;
      });

}

module.exports = {createConsent, updateConsent, getConsentList};