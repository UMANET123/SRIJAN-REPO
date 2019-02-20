const pool = require('../config/db');
const addMinToDate = require('../helpers/add-minute-to-date');
const {createTransaction} = require('./_transaction.util');
const {setOtpSettings, getNewOtp, getNewSecret, insertOtpRecord, checkBlackListApp} = require('./helper.model');
const updatePhoneNo = require('../helpers/mobile-number.modify');
console.log({updatePhoneNo});
//  generate otp and save to db
function generateTOtp(...args) {
    let [msisdn, app_id, blacklist, callback] = args;
    msisdn = updatePhoneNo(msisdn);
    setOtpSettings();
    if (blacklist) {
      checkBlackListApp({msisdn, app_id}, callback);
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
        return callback(    {
          "error_code": "BadRequest",
          "error_message": "Bad Request"
        });
    
      } );
}

//  get user subscriber_id or phone no



module.exports = {generateTOtp, verifyTOtp};
