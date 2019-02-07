const pool = require('../config/db');
const otplib = require('otplib');
const uuidv4 = require('uuid/v4');
// const qrcode = require('qrcode');
const {OTP_SETTINGS:{timer, step}} = require('../config/environment');

// const get = function (key, cb) {
//     db.get(key, cb);
// }

// const del = function (key) {
//     db.del(key);
// }

exports.generateOtp = function (key, cb) {
    let secret = otplib.authenticator.generateSecret();
    otplib.totp.options = {
        step: step,
        window: timer
    };
    // db.set(key, secret);
    //  create a record for mask table
    let uuid = uuidv4();
    pool.query(`INSERT INTO subscriber_data_mask(uuid, phone_no, created, status) values(${uuid}, ${key}, ${'now()'}, 0)`, (err, res) => {
        console.log(err, res);
        // pool.end()
      });
    //    get otp
    let otp = otplib.totp.generate(secret);
    // create a record for otp table
    pool.query(`INSERT INTO subscriber_otps(uuid, phone_no, created, status) values(${uuid}, ${key}, ${'now()'}, 0)`, (err, res) => {
        console.log(err, res);
        // pool.end()
      });
    cb(otp);

}

exports.verifyTotp = function (key, otp, cb) {
    get(key, (err, data) => {
        if (data) {
            let verify = otplib.totp.verify({
                token: otp,
                secret: data
            })
            if (verify) {
                del(key);
            }

            return cb(verify);
        } else {
            return cb(false);
        }
    })
}

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