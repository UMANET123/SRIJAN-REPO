const pool = require('../config/db');

//  check blacklist app 
function checkBlacklist({subscriber_id, app_id}, callback) {
    //  create transaction
    (async () => {
      const client = await pool.connect();
      try {
        //  select status of blacklist app
        let table =`subscriber_blacklist_apps`;
        // console.log({subscriber_id, app_id});
        let record =  await client.query(`SELECT blacklist_status FROM ${table} where uuid=($1) and app_id=($2)`,[subscriber_id, app_id]);
        // console.log({record: record.rows[0]});
        //  check blacklist status code
        if ( record.rows[0]) {
            let {blacklist_status} = record.rows[0];
            switch(parseInt(blacklist_status)) {
              // true for blacklist status 1
              case 1 :
                //  it is blacklised app
                 callback (200, {
                  "is_blacklisted": true
                });
              //  false for blacklist status 0
              case 0 :
              //  it is not blacklisted app
                callback( 200, {
                  "is_blacklisted": false
                });
              default:
                callback(204, null);
            }
        } else {
          callback(204, null);
       }
       return;
        //  create a record entry for app meta data 
       
      } finally {
        client.release();
      }
    })().catch(e => {
        console.log(e.stack);
        throw Error(e.message);
      });
}

//  create black list record
function createBlackList({subscriber_id, app_id , developer_id} , callback) {
  //  create transaction
  (async () => {
    const client = await pool.connect();
    //  create a record entry for subscriber consent
    let blacklist_app_table =`subscriber_blacklist_apps`;
    let subscriber_consent_table =`subscriber_consent`; 
    try {

      //  check if record exists in the blacklist for app_id, developer_id, subscriber_id
      let record =  await client.query(`select * from ${blacklist_app_table} where uuid=($1) and app_id=($2) and developer_id=($3)`,[subscriber_id, app_id, developer_id]);

      if ( record.rows[0]) {
        //  return if record exists
        return callback(302, {"status": "Record already exists!"});
      } else {
        //  update a subscriber consent method status 0
        let recordResponse = await client.query(`UPDATE ${subscriber_consent_table} SET status=($1) WHERE uuid=($2) and app_id=($3) and developer_id=($4) and status=($5) RETURNING access_token`, [1, subscriber_id, app_id, developer_id, 0]);
        //  on success create a record in blacklist table
        if (recordResponse.rows[0]){
          //  return the token from subscriber_consent table
          let token = recordResponse.rows[0].access_token;
          //  insert record to blacklist table with blacklist_status 1 , status 0
          await client.query(`INSERT INTO ${blacklist_app_table}(uuid, app_id, developer_id, blacklist_status, created, status) values ($1, $2, $3, $4, $5, $6)`,[subscriber_id, app_id, developer_id, 1, new Date(), 0]);
          //  
          if (!token)   return callback(403, {"status": "Forbidden"});
          callback(201, {"revoked_tokens": [token]});
        } else {
          callback(403, {"status": "Forbidden"});
        }
        return;
      }

      
    } finally {
      client.release();
    }
  })().catch(e => {
      console.log(e.stack);
      return callback(204, {"status": "Record Not Found"});
    });
}


module.exports = {checkBlacklist, createBlackList};