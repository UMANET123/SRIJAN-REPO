const pool = require('../config/db');
const otplib = require('otplib');
// const uuidv4 = require('uuid/v4');
const addMinToDate = require('../helpers/add-minute-to-date');
const {OTP_SETTINGS:{timer, step}} = require('../config/environment');


function generateTOtp(key, app_id, developer_id , cb) {
    let secret = otplib.authenticator.generateSecret();
    // console.log(secret);
    otplib.totp.options = {
        step: step,
        window: timer
    };

    //  get otp by app-id, uuid, developer id
    //  check if any opt with same credentials exists 
  
    pool.connect(function(err, client, done) {
        if (err) {
            console.error('Error connecting to pg server' + err.stack);
            throw err;
        } else {
            console.log('Connection established with pg db server');
        
            client.query(`SELECT opt FROM subscriber_otps inner join 
            subscriber_data_mask on
            subscriber_otps.uuid=subscriber_data_mask.uuid
            where app_id=($1) and
            developer_id=($2)`, [app_id, developer_id], (err, res) => {
        
                if (err) {
                    console.error('Error executing query on pg db' + err.stack);
                    callback(err);
                } else {
                    if (err) throw err;
                let otp = null;
                if (res.rows && res.rows[0]) {
                    otp = res.rows[0].opt;
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
                client.release();
             }
        });
    }
        
        });  
    pool.end();
 
  

}

// insert query transaction for totp for /generate/totp endpoint
function invokeTOtpToDb({secret, key, otplib, app_id, developer_id}) {
    // let uuid = uuidv4();
    let currentDate = new Date();
    //  create a record for mask table
    try {
        pool.query(`INSERT INTO subscriber_data_mask(uuid, phone_no, created, status) values($1,$2, $3, $4)`,
        [secret, key, currentDate, 0]);
    }catch (err) {
        throw err;
    }
    
    //    get otp
    let otp = otplib.totp.generate(secret);
    let expiration = addMinToDate(currentDate, 5);
     // create a record for otp table
    try {
       
        pool.query(`INSERT INTO subscriber_otps(uuid, app_id, developer_id, opt, expiration,                    status) values($1, $2, $3, $4, $5, $6)`, 
        [secret, app_id, developer_id, otp, expiration, 0]);
        pool.end();
    } catch (err) {
        throw err;
    }
    return otp;
}


//  verify OTP
function verifyTOtp(key, otp, app_id, developer_id) {

}
// exports.verifyTotp = function (key, otp, cb) {
//     get(key, (err, data) => {
//         if (data) {
//             let verify = otplib.totp.verify({
//                 token: otp,
//                 secret: data
//             })
//             if (verify) {
//                 del(key);
//             }

//             return cb(verify);
//         } else {
//             return cb(false);
//         }
//     })
// }

// exports.generateHotp = function (key, cb) {
//     let secret = otplib.authenticator.encode(`${key}`);
//     let otpurl = otplib.authenticator.keyuri(key, '2fa', secret)
//     qrcode.toDataURL(otpurl, (error, base64) => {
//         if (error) {
//             return cb(error, null)
//         }
//         return cb(null, base64)
//     })
// }

// exports.verifyHotp = function (key, otp, cb) {
//     let secret = otplib.authenticator.encode(`${key}`);
//     cb(otplib.authenticator.verify({
//         token: otp,
//         secret: secret
//     }))
// }

// exports.get = get;
// exports.del = del;

module.exports = {generateTOtp, verifyTOtp};