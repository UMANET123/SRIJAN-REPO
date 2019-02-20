const pool = require('../config/db');

//  create a transaction
function validateTransaction(...args) {
    let [reqParams, callback] = args;
    let {transaction_id, subscriber_id, app_id} = reqParams;
     //  create a transaction record
      (async () => {
        const client = await pool.connect();
        try {
          // insert transaction record
          await client.query("INSERT INTO transaction_data(transaction_id, uuid, app_id, created, status) values($1, $2, $3, $4, $5)", [txnId, subscriberId, appId, currentDate, status]);
          callback(txnId);
       } finally {
          client.release();
        }
      })().catch(e =>{
        console.log(e.stack);
        callback(false);
      } );
  
  }

module.exports = {validateTransaction};