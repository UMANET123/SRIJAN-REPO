const crypto = require('crypto');
const secretGen = require('../config/secret-generator');
let secret;
setTimeout(() => {
    secretGen.secretGenerator((data) => {
        secret = data;
    })
}, 500)

exports.encrypt = function (text) {
    var cipher = crypto.createCipher('aes-256-cbc', secret);
    var crypted = cipher.update(text, 'utf8', 'hex');
    crypted += cipher.final('hex');
    return crypted;
}

exports.decrypt = function (text) {
    var decipher = crypto.createDecipher('aes-256-cbc', secret);
    var dec = decipher.update(text, 'hex', 'utf8');
    dec += decipher.final('utf8');
    return dec;
}