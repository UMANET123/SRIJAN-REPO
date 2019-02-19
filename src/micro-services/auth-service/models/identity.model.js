const otplib = require('otplib');
const crypto = require('crypto');

const pool = require('../config/db');
const addMinToDate = require('../helpers/add-minute-to-date');
const {OTP_SETTINGS:{timer, step}, } = require('../config/environment');
const { checkBlackListApp} = require('./_auth.helper');

//  create new otp
function getNewOtp(secret) {
  return otplib.authenticator.generate(secret);
}
// create new secret
function getNewSecret(msisdn) {
  return crypto.createHash('md5').update(msisdn).digest('hex');
}
//  update std code +63 if not exists
function validateAndUpdateMsisdn(msisdn) {
  if (msisdn.startsWith('+63')) return msisdn;
  if (msisdn.startsWith('63')) return `+${msisdn}`;
  return `+63${msisdn}`;
}
//  
//  generate otp and save to db
function generateTOtp(...args) {
    let [msisdn, app_id, blacklist, callback] = args;
    msisdn = validateAndUpdateMsisdn(msisdn);
    otplib.totp.options = {
        step: step,
        window: timer
    };
    if (blacklist) {
      checkBlackListApp({msisdn, app_id});
    } 
    //  get otp by app-id, uuid
    //  check if any otp with same credentials exists 
    (async () => {
        const client = await pool.connect();
        try {
          //  get otp 
          const res = await client.query(`SELECT otp, otp.uuid FROM subscriber_otps otp,
          subscriber_data_mask mask
          where otp.uuid=mask.uuid and
          otp.app_id=($1) and mask.phone_no=($2)`, [app_id, msisdn]);
          // console.log({app_id, msisdn, res: res.rows[0]});
            if (res.rows[0]) {
              // console.log('otp need to be updated');
               let {otp, uuid} = res.rows[0];
               if (otp && uuid) {
                //  update the record
                let newOtp = getNewOtp(uuid);
                await client.query(`UPDATE subscriber_otps SET otp=($1), expiration=($2) WHERE uuid=($3) and app_id=($4)`, 
                [newOtp, addMinToDate(new Date(), 5) , uuid, app_id]);
                callback(newOtp, uuid, 200);
              } 
           
          }  else {
            //  create record for otp and update tables

            //  get new Secret
            let secret = getNewSecret(msisdn);
            //  get new otp for new record
            let otp = getNewOtp(secret);
            //  insert records to the table
            insertOtpRecord({otp, secret, msisdn, app_id});
            callback(otp, secret, 201);
          }
        } finally {
          client.release();
        }
      })().catch(e => {
        console.log(e.stack)
       callback(    {
          "error_code": "BadRequest",
          "error_message": "Bad Request"
        });
      });
}

// insert query transaction for totp for /generate/totp endpoint
function insertOtpRecord({secret, otp, msisdn, app_id}) {
    // console.log('insert otp mask called');
    //  create a record for mask table  
    (async () => {
        const client = await pool.connect();
        try {
            let currentDate = new Date();
            //  check for any record exists with the phone
            let mask= await client.query(`SELECT uuid FROM subscriber_data_mask WHERE phone_no=($1)`, [msisdn]);
            if (!mask.rows[0]) {
              //  insert record to mask table
              await client.query(`INSERT INTO subscriber_data_mask(uuid, phone_no, created, status) values($1, $2, $3, $4)`,
              [secret, msisdn, currentDate, 0]);
              console.log('mask table record created');
            } else {
              //  update secret as existing uuid 
              secret = mask.rows[0].uuid;
            }
            // insert new otp record
           await client.query(`INSERT INTO subscriber_otps(uuid, app_id, otp, expiration,                    status) values($1, $2, $3, $4, $5)`, 
            [secret, app_id, otp, addMinToDate(currentDate, 5), 0]);
        } finally {
            client.release();
        }
    })().catch(e => {
      console.log(e.stack);
      return Error;
    });
  
}
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
        //  insert transaction record
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

//  verify OTP
function verifyTOtp({subscriber_id, otp, app_id }, callback) {
    (async () => {
        const client = await pool.connect();
        let currentDate = new Date();
        try {
          //  get valid otp with  given params {subscriber_id, otp, app_id}
          const otpRes = await client.query(`SELECT * FROM subscriber_otps
          where otp=($1) and uuid=($2) and ($3) < expiration and app_id=($4)`, [otp, subscriber_id, currentDate, app_id]);
          //  check for valid otp
          if (otpRes.rows[0]) {
              // create a transaction
              createTransaction(null, subscriber_id, app_id,currentDate, 0, txnId => {
                callback( {transaction_id: txnId} ,200);
              });
            } else {
              return callback({
                "error_code": "Unauthorized",
                "error_message": "OTP Verification Failed"
              }, 401);
            }
        } finally {
          client.release();
        }
      })().catch(e =>{
        console.log(e.stack);
        callback(    {
          "error_code": "BadRequest",
          "error_message": "Bad Request"
        });
    
      } );
}

//  get user subscriber_id or phone no

function verifyUser(phone_no, uuid, callback) {
    (async () => {
        const client = await pool.connect();
        try {
            let query = null;
            // for  phone no find uuid
            if (phone_no) {
                query = `SELECT uuid FROM subscriber_data_mask where phone_no='${phone_no}'`;
            } else {
                 // find phone_no
                query= `SELECT phone_no FROM subscriber_data_mask where uuid='${uuid}'`;
            }
          const res = await client.query(query);
          if (res.rows && res.rows[0]) {
            callback(res.rows[0], 200);
        } else {
          callback(null, 404);
        }

        } finally {
          client.release();
        }
      })().catch(e => 
        {
          console.log(e.stack)
          callback({
            "error_code": "BadRequest",
            "error_message": "Bad Request"
          }, 404);
        });
}

module.exports = {generateTOtp, verifyTOtp, verifyUser};
