/**
 * MAJOR TODO
 * - Write test cases for each and every case
 * - Write error handlers for every possible condition
 * - Move towards a pure function approach
 */

const pool = require('../config/db');
const addMinToDate = require('../helpers/add-minute-to-date');
const {createTransaction} = require('./_transaction.util');
const {setOtpSettings, getNewOtp, getNewSecret, insertOtpRecord, checkBlackListApp} = require('./helper.model');
const updatePhoneNo = require('../helpers/mobile-number.modify');
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
            if (res.rows[0]) {
               let {otp, uuid} = res.rows[0];
               if (otp && uuid) {
                //  update the record
                let accountBlockedCheck = await client.query(`SELECT * FROM flood_control WHERE uuid=($1) AND app_id=($2)`,[uuid,app_id])
                
                if (accountBlockedCheck.rowCount != 0){
                  if(accountBlockedCheck.rows[0].status==1){
                    let created_at = new Date(accountBlockedCheck.rows[0].created_at).getTime();
                    let current_time = new Date().getTime();
                    let difference = Math.round(((current_time - created_at )/1000)/60);
                    if(difference >= 30){
                      await client.query(`DELETE FROM flood_control WHERE uuid=($1) AND app_id=($2)`,[uuid,app_id])
                      await client.query(`INSERT INTO flood_control(uuid, app_id) VALUES($1,$2)`,[uuid, app_id])
                    } else {
                      callback(null, null, 401 )
                    }
                  }
                } else {
                  await client.query(`INSERT INTO flood_control(uuid, app_id) VALUES($1,$2)`,[uuid, app_id])
                }
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

/**
 * 
 * @param {Mobile Number : string} msisdn 
 * @param {Application ID : string} app_id 
 * @param {Blacklist : boolean} blacklist 
 * @param {Call back} callback 
 */
function generateTOTP(msisdn, app_id, blacklist, callback){
  /**
   * Fix Mobile number formatting
   * Check if app is black listed
   * Check if OTP already present based on APP ID and MSISDN
   *    - If present, fetch flood control table, check if retry count is < 3 and status != 1
   *    - If status == 1 and retry count >= 3 the return bad response
   *    - If status !=1 and retry count < 3, delete the row and generate a new OTP and new Flood control row
   */
  msisdn = updatePhoneNo(msisdn);       // This will update the phone number and fix any formatting issues
  setOtpSettings();                     // This will set the OTPLIB window and step timer

  if(blacklist){
    
  }

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

          // check if account is blocked
          const blockedOTP = await client.query(`SELECT * FROM flood_control 
                                                WHERE uuid=($1)
                                                AND app_id=($2)`,
                                                [subscriber_id, app_id]);
          if(blockedOTP.rowCount != 0) {
            if(blockedOTP.rows[0].retry >= 3){
              let created_at = new Date(blockedOTP.rows[0].created_at).getTime();
              let current_time = new Date().getTime();
              let difference = Math.round(((current_time - created_at )/1000)/60);
              if(difference < 30){
                if(blockedOTP.rows[0].status == 0){
                  await client.query(`UPDATE flood_control SET Status=1 WHERE uuid=($1) AND app_id=($2)`,[subscriber_id,app_id])
                }
                return callback({
                  "error_code": "Account Blocked",
                  "error_message": "Account Blocked, please try after 30 mins"
                }, 401)
              } else {
                await client.query(`DELETE FROM flood_control WHERE uuid=($1) AND app_id=($2)`,[subscriber_id,app_id])
              }
            }
          }
          //  check for valid otp
          if (otpRes.rows[0]) {
              // create a transaction
              await client.query(`DELETE FROM flood_control WHERE uuid=($1) AND app_id=($2)`,[subscriber_id,app_id])
              createTransaction(null, subscriber_id, app_id,currentDate, 0, txnId => {
                callback( {transaction_id: txnId} ,200);
              });
            } else {
              // add retry counter
              /**
               * ID
               * UUID
               * APP_ID
               * CREATED_AT
               * STATUS, default 0 = unblocked, 1 = blocked, 
               * RETRY, default 0 +1 , ==3 set STATUS to 1
               * 
               * unblock after 30 mins
               */
              await client.query(`UPDATE flood_control SET Retry=Retry+1 WHERE uuid=($1) AND app_id=($2)`,[subscriber_id,app_id])

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



module.exports = {generateTOtp, verifyTOtp, generateTOTP};
