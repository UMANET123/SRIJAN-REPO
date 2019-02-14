
const pool = require('../config/db');
//  revoke consent for a single record
function revokeSingleConsent({subscriber_id, app_id, developer_id}, callback) {
    //  create transaction
    (async () => {
    const client = await pool.connect();
    try {
        let consentTable=`subscriber_consent`;
        let record = await client.query(`UPDATE ${consentTable} SET scopes=($1), status=($2) WHERE uuid=($3) and app_id=($4) and developer_id=($5) RETURNING access_token`, [null, 1, subscriber_id, app_id, developer_id ]);
        if (record.rows[0]) {
          let {access_token} = record.rows[0];
          callback(200, {"revoked_token": [access_token]});  
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

module.exports = {revokeSingleConsent};