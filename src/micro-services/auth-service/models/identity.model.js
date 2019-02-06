const db = require('../config/db');
const otplib = require('otplib');
const qrcode = require('qrcode');
const environment = require('../config/environment');

const get = function (key, cb) {
    db.get(key, cb);
}

const del = function (key) {
    db.del(key);
}

exports.set = function (key, cb) {
    let secret = otplib.authenticator.generateSecret();
    otplib.totp.options = {
        step: environment.OTP_STEP,
        window: environment.OTP_TIMER
    };
    db.set(key, secret);
    let otp = otplib.totp.generate(secret);
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

exports.generateHotp = function (key, cb) {
    let secret = otplib.authenticator.encode(`${key}`);
    let otpurl = otplib.authenticator.keyuri(key, '2fa', secret)
    qrcode.toDataURL(otpurl, (error, base64) => {
        if (error) {
            return cb(error, null)
        }
        return cb(null, base64)
    })
}

exports.verifyHotp = function (key, otp, cb) {
    let secret = otplib.authenticator.encode(`${key}`);
    cb(otplib.authenticator.verify({
        token: otp,
        secret: secret
    }))
}

exports.get = get;
exports.del = del;