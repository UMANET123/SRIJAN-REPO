
const pool = require('../config/db');
//  revoke consent for a single record
function revokeSingle({subscriber_id, app_id, developer_id}, callback) {
    //  create transaction
    (async () => {
    const client = await pool.connect();
    try {
        let consentTable=`subscriber_consent`;
        let record = await client.query(`UPDATE ${consentTable} SET scopes=($1), status=($2) WHERE uuid=($3) and app_id=($4) and developer_id=($5) RETURNING access_token`, [null, 1, subscriber_id, app_id, developer_id ]);
        if (record.rows[0]) {
          let {access_token} = record.rows[0];
          callback(200, {"revoked_tokens": [access_token]});  
       } else {
          callback(204, { "status" : "Record Not Found" });
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
            let tokenArray = record.rows.map(({access_token}) => access_token);
            callback(200, {"revoked_tokens": tokenArray});  
          } else {
            callback(204, { "status" : "Record Not Found" });
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