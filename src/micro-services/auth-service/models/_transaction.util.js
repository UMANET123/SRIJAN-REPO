const pool = require('../config/db');
const {getNewSecret} = require('./helper.model');
//  create a transaction
function createTransaction(...args) {
    let [txnId, subscriberId, appId, currentDate, status, callback] = args;
    if (!txnId) {
      //  create txnid
      let secret_key = subscriberId + appId + currentDate.getTime();
      console.log(secret_key);
      txnId = getNewSecret(secret_key);
    }
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

module.exports = {createTransaction};