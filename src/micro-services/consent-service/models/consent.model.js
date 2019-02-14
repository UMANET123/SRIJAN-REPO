const { createAppMetaData} = require('./_util.model');
const pool = require('../config/db');

function createConsent({subscriber_id, access_token, app_id, developer_id, scopes, appname}, callback) {
    //  create transaction
    (async () => {
        const client = await pool.connect();
        try {
          //  create a record entry for subscriber consent
          let consent_table =`subscriber_consent`;
          let record =  await client.query(`select * from ${consent_table} where uuid=($1) and app_id=($2) and developer_id=($3)`,[subscriber_id, app_id, developer_id]);
          let createdDate = new Date();
          if ( record.rows[0]) {
            let scopeFound = record.rows[0].scopes;
            if ( JSON.stringify(scopeFound) == JSON.stringify(scopes)) {
              callback(302, { "status" : "Record already Exists!"});
            } else {
                  let old_token = await client.query(`UPDATE ${consent_table} SET scopes=($1), access_token=($2),  updated=($3) WHERE  uuid=($4) and app_id=($5) and developer_id=($6) RETURNING (SELECT access_token FROM ${consent_table} WHERE uuid=($4) and app_id=($5) and developer_id=($6))`, [JSON.stringify(scopes), access_token, createdDate, subscriber_id, app_id, developer_id ]);
                  callback(200, {
                    "old_token": true,
                    "old_token_value": old_token.rows[0].access_token
                  });
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

function updateConsent({subscriber_id, access_token, app_id, developer_id, scopes, appname}, callback) {
    
    //  create transaction
    (async () => {
       const client = await pool.connect();
       try {
           let table=`subscriber_consent`;
           let record = await client.query(`UPDATE ${table} SET scopes=($1), access_token=($2), updated=($3) WHERE uuid=($4) and app_id=($5) and developer_id=($6)  RETURNING (SELECT access_token FROM ${table} WHERE uuid=($4) and app_id=($5) and developer_id=($6))`, [JSON.stringify(scopes),access_token, new Date(), subscriber_id, app_id, developer_id ]);
           if (record.rows[0]) {
             let {access_token} = record.rows[0];
             callback(200, {old_token: true,
             old_token_value: access_token});  
           } else {
             callback(400, {
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

function getConsentList(subscriber_id, callback){
  //SELECT consent.app_id, appname, consent.developer_id, scopes FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id 
//where status=0 and scopes IS NOT null
//  create transaction
    (async () => {
      const client = await pool.connect();
      try {
          let record = await client.query("SELECT consent.app_id, appname, consent.developer_id, scopes FROM public.subscriber_consent consent inner join apps_metadata app on consent.app_id=app.app_id and consent.developer_id=app.developer_id where uuid=($1) and status=($2) and scopes IS NOT ($3)", [subscriber_id, 0, null]);
          if (record.rows[0]) {
            console.log(record.rows);
            callback(200, {old_token: true,
            old_token_value: access_token});  
          } else {
            callback(400, {
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

module.exports = {createConsent, updateConsent, getConsentList};