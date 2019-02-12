const pool = require('../config/db');
const otplib = require('otplib');
const addMinToDate = require('../helpers/add-minute-to-date');
const {OTP_SETTINGS:{timer, step}} = require('../config/environment');

//  create new otp
function getNewOtp(secret) {
  return otplib.authenticator.generate(secret);
}
// create new secret
function getNewSecret() {
  return otplib.authenticator.generateSecret();
}
//  generate otp and save to db
function generateTOtp(...args) {
    let [msisdn, app_id, blacklist, callback] = args;
      otplib.totp.options = {
        step: step,
        window: timer
    };
    let is_blacklist = false;
    if (blacklist) {
      //  create check blacklist api call and check response
      is_blacklist = true;
    } 
    if (is_blacklist) {
      callback(null,null, 403);
    }
    //  get otp by app-id, uuid
    //  check if any otp with same credentials exists 
    (async () => {
        const client = await pool.connect();
        try {
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
            let secret = getNewSecret();
            let otp = getNewOtp(secret);
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
            let mask= await client.query(`SELECT uuid FROM subscriber_data_mask WHERE phone_no=($1)`, [msisdn]);
            if (!mask.rows[0]) {
              await client.query(`INSERT INTO subscriber_data_mask(uuid, phone_no, created, status) values($1, $2, $3, $4)`,
              [secret, msisdn, currentDate, 0]);
              console.log('mask table record created');
            } else {
              //  udpate secret as existing uuid 
              secret = mask.rows[0].uuid;
            }
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


//  verify OTP
function verifyTOtp({subscriber_id, otp, app_id}, callback) {
    (async () => {
        const client = await pool.connect();
        try {
          const otpRes = await client.query(`SELECT * FROM subscriber_otps
          where otp=($1) and uuid=($2) and ($3) < expiration and app_id=($4)`, [otp, subscriber_id, new Date(), app_id]);
          console.log({test: otpRes.rows[0]});
          if (otpRes.rows[0]) {
              return callback( null ,200);
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

//  get 

function verifyUser(phone_no, uuid, callback) {
    (async () => {
        const client = await pool.connect();
        try {
            let query = null;
            if (phone_no) {
                query = `SELECT uuid FROM subscriber_data_mask where phone_no='${phone_no}'`;
            } else {
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