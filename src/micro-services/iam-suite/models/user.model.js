const db = require('../config/db');
const crypt = require('../helpers/encryptdecrypt');
exports.get = function (key, cb) {
    db.get(key, cb);
}
exports.create = function (data, cb) {
    var user = {
        firstname: data.firstname,
        middlename: data.middlename,
        lastname: data.lastname,
        address: data.address,
        msisdn: data.msisdn,
        email: data.email,
        password: crypt.generateHash(data.password),
        emailVerify: false,
        twoFactorAuth: false,
        defaultTransponder:null
    }

    let emailHash = crypt.generateHash(user.email);
    db.set(emailHash, user.email, {
        option: 'EX',
        value: 1800
    });

    db.set(user.email, JSON.stringify(user));
    cb({
        email: user.email,
        hash: emailHash
    });
}
exports.update = function (key, data) {
    db.set(key, data);
}
exports.getEmailToken = function (key, cb) {
    db.get(key, cb);
}
exports.setEmailToken = function (key, token) {
    db.set(key, token, {
        option: 'EX',
        value: 1800
    });
}
exports.verify = function () {}
exports.delete = function () {}