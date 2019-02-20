const pool = require('../config/db');

//  validate a transaction
function validateTransaction(...args) {
    let [reqParams, callback] = args;
    let {transaction_id, subscriber_id, app_id} = reqParams;
     //  create a transaction record
      (async () => {
        const client = await pool.connect();
        try {
          // insert transaction record
          let txnRecord = await client.query("SELECT * FROM transaction_data WHERE transaction_id=($1) and uuid=($2) and app_id=($3) and status=($4)", [transaction_id, subscriber_id, app_id, 0]);
          let txnValid = false;
          if(txnRecord.rows[0]) {
            txnValid = true;
          } 
          callback(200, {
            "is_valid": txnValid
          });

       } finally {
          client.release();
        }
      })().catch(e =>{
        console.log(e.stack);
      } );
  
  }

//  invalidate a transaction
function invalidateTransaction(...args) {
    let [reqParams,reqBody, callback] = args;
    let {transaction_id} = reqParams;
    let {subscriber_id, app_id} = reqBody;
     // create a transaction record
    (async () => {
      const client = await pool.connect();
      try {
        // insert transaction record
        let txnRecord = await client.query("UPDATE transaction_data SET status=($1) WHERE transaction_id=($2) and uuid=($3) and app_id=($4)", [1, transaction_id, subscriber_id, app_id]);
        let txnValid = false;
        if(txnRecord.rows[0]) {
          txnValid = true;
        } 
        callback(200, {
          "is_valid": txnValid
        });

      } finally {
        client.release();
      }
    })().catch(e =>{
      console.log(e.stack);
    } );
  
  }

module.exports = {validateTransaction, invalidateTransaction};