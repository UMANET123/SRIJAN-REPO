exports.generateHash = function (text) {
    console.log('Here')
    let res = require('crypto').createHash('md5').update(text).digest('hex');
    console.log(res)
    console.log('There')
    return res;
}