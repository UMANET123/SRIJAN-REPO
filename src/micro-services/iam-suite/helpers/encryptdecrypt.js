const crypto = require('crypto');
let secret;
crypto.randomBytes(48, function (err, buffer) {
    secret = buffer.toString('hex');
});
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