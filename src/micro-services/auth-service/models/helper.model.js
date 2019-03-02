require('dotenv').config();
const crypto = require('crypto');
const otplib = require('otplib');
const axios = require('axios');
const {OTP_SETTINGS:{timer, step} } = require('../config/environment');
const {verifyUser} = require('./auth.model');
const pool = require('../config/db');
const addMinToDate = require('../helpers/add-minute-to-date');
//  create new otp
function getNewOtp(secret) {
    return otplib.authenticator.generate(secret);
}
  // create new secret
function getNewSecret(msisdn) {
    return crypto.createHash('md5').update(msisdn).digest('hex');
}

/**
 * Todo
 * - Better naming convention
 */
function setOtpSettings() {
    otplib.totp.options = {
        step: step,
        window: timer
    };
}
// insert query transaction for totp for /generate/totp endpoint
function insertOtpRecord({secret, otp, msisdn, app_id}) {
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
            // await client.query(`DELETE FROM flood_control WHERE uuid=($1) AND app_id=($2)`,[secret,app_id]);
            // await client.query(`INSERT INTO flood_control(uuid, app_id) values($1, $2)`,[secret,app_id]);
            await client.query(`DELETE FROM flood_control WHERE uuid=($1)`,[secret]);
            await client.query(`INSERT INTO flood_control(uuid) values($1)`,[secret]);

        } finally {
            client.release();
        }
    })().catch(e => {
      console.log(e.stack);
      return Error;
    });
  
}

//  check app-subsubser blacklisted
function  checkBlackListApp({msisdn, app_id}, callback) {

    let consent_base_url= process.env.CONSENT_SERVICE_BASEPATH;
    // get uuid from phone
    verifyUser(msisdn, null, (response) => {
        if (response && response.uuid) {
            //  do a query to check blacklist api with uuid and msisdn
            let reqUrl=`${consent_base_url}/blacklist/${response.uuid}/${app_id}`;
            axios.get(reqUrl)
                .then(({data}) =>{
                   if (data) {
                      return callback({
                        "error_code": "Forbidden",
                        "error_message": "App is blacklisted"
                      },
                       403); 
                   } 
                })
                .catch(function (error) {
                     console.log(error);
                });
        }
    });
}

module.exports = {getNewOtp, getNewSecret, setOtpSettings, insertOtpRecord, checkBlackListApp};
