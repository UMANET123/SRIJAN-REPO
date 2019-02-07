const pool = require('../config/db');
const otplib = require('otplib');
const uuidv4 = require('uuid/v4');
const addMinToDate = require('../helpers/add-minute-to-date');
const {OTP_SETTINGS:{timer, step}} = require('../config/environment');


function generateTOtp(key, app_id, developer_id , cb) {
    let secret = otplib.authenticator.generateSecret();
    otplib.totp.options = {
        step: step,
        window: timer
    };

    //  get otp by app-id, uuid, developer id
    //  check if any opt with same credentials exists 
    try {
        pool.query(`SELECT opt FROM subscriber_otps inner join 
        subscriber_data_mask on
        subscriber_otps.uuid=subscriber_data_mask.uuid
        where app_id=($1) and
        developer_id=($2)`, [app_id, developer_id], 
        (err, res) => {
            if (err) throw err;
            let otp = null;
            if (res.rows && res.rows[0]) {
                otp = res.rows[0].opt;
            } 
            let otpStatus = null;
            if (!otp) {
                //  invoke otp
                console.log('create otp');
                otp = invokeTOtpToDb({secret, key, otplib, app_id, developer_id});
                otpStatus = 201;
            } else {
                console.log('no otp');
                otpStatus = 200;
            }
            console.log({otp, otpStatus});
            pool.end();
            cb(otp, otpStatus);
        });
    //     getUuidQuery.on('row', row => {
    //             console.log(otpRow.opt);
    //             let otp = otpRow.opt;
    //             let otpStatus = null;
    //             console.log({otp, otpStatus});
    //             if (!otp) {
    //                 //  invoke otp
    //                 console.log('all otp');
    //                 otp = invokeTOtpToDb({secret, key, otplib, app_id, developer_id});
    //                 otpCreationStatus = 201;
    //             } else {
    //                 console.log('no otp');
    //                 otpCreationStatus = 200;
    //             }
    //             console.log({otp, otpStatus});
    //             // cb(otp, otpStatus);
             
    //         });
    //      });
       
    } catch (err) {
        throw err;
    }
  

}

// insert query transaction for totp for /generate/totp endpoint
function invokeTOtpToDb({secret, key, otplib, app_id, developer_id}) {
    let uuid = uuidv4();
    let currentDate = new Date();
    //  create a record for mask table
    try {
        pool.query(`INSERT INTO subscriber_data_mask(uuid, phone_no, created, status) values($1,$2, $3, $4)`,
        [uuid, key, currentDate, 0]);
    }catch (err) {
        throw err;
    }
    
    //    get otp
    let otp = otplib.totp.generate(secret);
    let expiration = addMinToDate(currentDate, 5);
     // create a record for otp table
    try {
       
        pool.query(`INSERT INTO subscriber_otps(uuid, app_id, developer_id, opt, expiration,                    status) values($1, $2, $3, $4, $5, $6)`, 
        [uuid, app_id, developer_id, otp, expiration, 0]);
        pool.end();
    } catch (err) {
        throw err;
    }
    return otp;
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

module.exports = {generateTOtp};