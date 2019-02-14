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

function createAppMetaData(...args) {
  let [callback, app_id, developer_id, appname, created, short_description, long_description, developer_name] = args;
      //  create app meta transaction
  (async () => {
    const client = await pool.connect();
    try {
      //  create a record entry for subscriber consent
      let apps_meta_table =`apps_metadata`;
      let record =  await client.query(`select * from ${apps_meta_table} where app_id=($1) and developer_id=($2)`,[app_id, developer_id]);

      if (! record.rows[0]) {
        await client.query(`INSERT INTO ${apps_meta_table}(app_id, developer_id, appname, short_description, long_description, developer_name, created) values ($1, $2, $3, $4, $5, $6, $7)`, [app_id, developer_id, appname, short_description,  long_description, developer_name, created]);
      }  
      callback(201, {
        "old_token": false,
        "old_token_value": ""
      });       
    } finally {
      client.release();
    }
  })().catch(e => {
      console.log(e.stack);
      throw e;
      // callback(400, {status: "Failed"})
    });
  
}

function updateAppMetaData(...args) {
    let [callback, app_id, developer_id, appname, updated, short_description, long_description, developer_name] = args;
    //  create app meta transaction
  (async () => {
  const client = await pool.connect();
  try {
    //  create a record entry for subscriber consent
    // UPDATE ${table} SET scopes=($1), access_token=($2), updated=($3) WHERE uuid=($4) and app_id=($5) and developer_id=($6)
    let apps_meta_table =`apps_metadata`;
    await client.query(`UPDATE ${apps_meta_table} SET short_description=($1), long_description=($2), developer_name=($3), updated=($4) WHERE app_id=($5) and developer_id=($6) and appname=($7)`, [ short_description, long_description, developer_name, updated, app_id, developer_id, appname]);
      callback(200, null);
           
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



//  check blacklist app 
function checkBlacklist({subscriber_id, app_id}, callback) {
      //  create transaction
      (async () => {
        const client = await pool.connect();
        try {
          //  select status of blacklist app
          let table =`subscriber_blacklist_apps`;
          console.log({subscriber_id, app_id});
          let record =  await client.query(`SELECT blacklist_status FROM ${table} where uuid=($1) and app_id=($2)`,[subscriber_id, app_id]);
          console.log({record: record.rows[0]});
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
          callback(302, {"status": "Record already exists!"});
        } else {
          //  update a subscriber consent method status 0
          let recordResponse = await client.query(`UPDATE ${subscriber_consent_table} SET status=($1) WHERE uuid=($2) and app_id=($3) and developer_id=($4) RETURNING access_token`, [1, subscriber_id, app_id, developer_id]);
          //  on success create a record in blacklist table
          if (recordResponse.rows[0]){
            //  return the token from subscriber_consent table
            let token = recordResponse.rows[0].access_token;
            //  insert record to blacklist table with blacklist_status 1 , status 0
            await client.query(`INSERT INTO ${blacklist_app_table}(uuid, app_id, developer_id, blacklist_status, created, status) values ($1, $2, $3, $4, $5, $6)`,[subscriber_id, app_id, developer_id, 1, new Date(), 0]);
            //  
            callback(201, {"revoked_tokens": [token]});
          } else {
            callback(204, {"status": "Record Not Found"});
          }

        }

        
      } finally {
        client.release();
      }
    })().catch(e => {
        console.log(e.stack);
        callback(204, {"status": "Record Not Found"});
      });
}
module.exports = {createConsent, updateConsent, checkBlacklist, createBlackList};