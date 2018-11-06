exports.generateHash = function (text) {
    let res = require('crypto').createHash('md5').update(text).digest('hex');
    return res;
}