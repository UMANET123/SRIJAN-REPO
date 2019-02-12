const pool = require('../config/db');
const otplib = require('otplib');
const addMinToDate = require('../helpers/add-minute-to-date');
const {OTP_SETTINGS:{timer, step}} = require('../config/environment');


function generateTOtp(key,app_id, developer_id , cb) {
    let secret = otplib.authenticator.generateSecret();
    console.log(secret);
    otplib.totp.options = {
        step: step,
        window: timer
    };

    //  get otp by app-id, uuid, developer id
    //  check if any otp with same credentials exists 
    (async () => {
        const client = await pool.connect();
        try {
          const res = await client.query(`SELECT otp FROM subscriber_otps otp,
          subscriber_data_mask mask
          where otp.uuid=mask.uuid and
          otp.app_id=($1) and
          otp.developer_id=($2) and
          mask.phone_no=($3)`, [app_id, developer_id, key]);
          let otp = null;
            if (res.rows && res.rows[0]) {
                otp = res.rows[0].otp;
            } 
            let otpStatus = null;
            if (!otp) {
                //  invoke otp
                otp = invokeTOtpToDb({secret, key, otplib, app_id, developer_id});
                otpStatus = 201;
            } else {
                otpStatus = 200;
            }
            cb(otp, otpStatus);
        } finally {
          client.release();
        }
      })().catch(e => console.log(e.stack));
}

// insert query transaction for totp for /generate/totp endpoint
function invokeTOtpToDb({secret, key, otplib, app_id, developer_id}) {
    // let uuid = uuidv4();
    let currentDate = new Date();
    //  create a record for mask table  
    (async () => {
        const client = await pool.connect();
        try {
            await client.query(`INSERT INTO subscriber_data_mask(uuid, phone_no, created, status) values($1,$2, $3, $4)`,
            [secret, key, currentDate, 0]);
        } finally {
            client.release();
        }
    })().catch(e => console.log(e.stack));
    //    get otp
    let otp = otplib.authenticator.generate(secret);
    let expiration = addMinToDate(currentDate, 5);
     // create a record for otp table
    (async () => {
    const client = await pool.connect();
    try {
        await client.query(`INSERT INTO subscriber_otps(uuid, app_id, developer_id, otp, expiration,                    status) values($1, $2, $3, $4, $5, $6)`, 
        [secret, app_id, developer_id, otp, expiration, 0]);
    } finally {
        client.release();
    }
    })().catch(e => console.log(e.stack));
    return otp;
}


//  verify OTP
function verifyTOtp(key, otp, app_id, developer_id, cb) {
    (async () => {
        const client = await pool.connect();
        try {
          const res = await client.query(`SELECT uuid FROM subscriber_data_mask
          where phone_no=($1)`, [key]);
          let uuid = null;
          if (res.rows && res.rows[0]) {
            uuid = res.rows[0].uuid;
          } 
        //   console.log({uuid});
          if (!uuid) return cb({status: "failed"});
          const otpRes = await client.query(`SELECT otp FROM subscriber_otps
          where uuid=($1) and ($2) < expiration and app_id=($3) 
          and developer_id=($4)`, [uuid, new Date(), app_id, developer_id]);
          let otpRetrieved = null;
          if (otpRes.rows && otpRes.rows[0]) {
            otpRetrieved = otpRes.rows[0].otp;
          } 
        //   console.log({otpRetrieved});
          if (parseInt(otpRetrieved) === parseInt(otp)) {
            return cb({status: "success"});
          } else {
            return cb({status: "failed"});
          }
        //     if (!secret) {
        //         cb(false);
        //     } else {
        //     let verify = otplib.authenticator.verify({
        //         token: otp,
        //         secret
        //     })
        //     console.log(verify);
        //     return cb(verify);
        // }

        } finally {
          client.release();
        }
      })().catch(e => console.log(e.stack));
}

//  get 

function verifyUser(phone_no, uuid, cb) {
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
          let item = null;
          if (res.rows && res.rows[0]) {
            item = res.rows[0];
        } 
          cb(item);
        } finally {
          client.release();
        }
      })().catch(e => console.log(e.stack));
}

module.exports = {generateTOtp, verifyTOtp, verifyUser};