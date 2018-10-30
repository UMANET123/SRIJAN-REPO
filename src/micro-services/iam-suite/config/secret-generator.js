const db = require('./db');
const crypto = require('crypto');

exports.secretGenerator = function (cb) {
    db.get('secret', (err, data) => {
        if (!data) {
            crypto.randomBytes(48, function (err, buffer) {
                secret = buffer.toString('hex');
                db.set('secret', secret, {
                    option: 'EX',
                    value: 3000
                })
                cb(secret)
            });
        } else(
            cb(data)
        )
    })
}