const pool = require('../config/db');



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
      return callback(201, {
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
    return callback(200, null);
           
  } finally {
    client.release();
  }
  })().catch(e => {
    console.log(e.stack);
    throw e;
  });
}



module.exports = {createAppMetaData, updateAppMetaData};