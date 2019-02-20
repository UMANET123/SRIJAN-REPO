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

module.exports = {validateTransaction};