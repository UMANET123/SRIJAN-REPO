
const pool = require('../config/db');
//  revoke consent for a single record
function revokeSingle({subscriber_id, app_id, developer_id}, callback) {
    //  create transaction
    (async () => {
    const client = await pool.connect();
    try {
        let consentTable=`subscriber_consent`;
        let record = await client.query(`UPDATE ${consentTable} SET scopes=($1), status=($2) WHERE uuid=($3) and app_id=($4) and developer_id=($5) and status=($6) RETURNING access_token`, [null, 1, subscriber_id, app_id, developer_id, 0 ]);
        if (record.rows[0]) {
          let {access_token} = record.rows[0];
          if (!access_token)   return callback(403, {"status": "Forbidden"});
          callback(200, {"revoked_tokens": [access_token]});  
       } else {
          callback(403, {"status": "Forbidden"});
        }
        return;
    } finally {
      client.release();
    }
  })().catch(e => {
      console.log(e.stack)
      throw e;
    });
}

function revokeAll(subscriber_id, callback) {
    //  create transaction
    (async () => {
      const client = await pool.connect();
      try {
          let consentTable=`subscriber_consent`;
          let record = await client.query(`UPDATE ${consentTable} SET scopes=($1), status=($2) WHERE uuid=($3) RETURNING access_token`, [null, 1, subscriber_id ]);
          console.log({tes: record.rows[0]});
          if (record.rows[0]) {
            let tokenArray = record.rows.map(({access_token}) => {
              if (!access_token) return access_token;
            });
            let isArrayAllNull = tokenArray.every(item => !item);
            if(! isArrayAllNull) {
              callback(200, {"revoked_tokens": tokenArray});  
            } else {
              callback(403, {"status": "Forbidden"});
            }
           
          } else {
            callback(403, {"status": "Forbidden"});
          }
        return;     
      } finally {
        client.release();
      }
    })().catch(e => {
        console.log(e.stack)
        callback(400, {
          "error_code": "BadRequest",
          "error_message": "Bad Request"
        });
      });
}

module.exports = {revokeSingle, revokeAll};