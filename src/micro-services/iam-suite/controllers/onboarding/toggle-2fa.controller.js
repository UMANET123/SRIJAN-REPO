const user = require('../../models/user.model');

/**
 * TODO
 * - Check for valid email
 * - Check for valid transponder type 
 *      (This will be solved if some enum is in place)
 */

exports.post = function (req, res) {
    let email = req.body.email;
    let twoFactorAuth = req.body.twoFactorAuth;
    let transponder = req.body.transponder

    user.get(email, (err, data) => {
        if (!err && data) {
            data = JSON.parse(data);
            data.twoFactorAuth = twoFactorAuth;
            data.defaultTransponder = transponder;
            user.update(email, JSON.stringify(data));
            return res.status(200).send({
                message: 'success'
            });
        } else {
            return res.status(400).send({
                'error': 'Invalid request'
            });
        }
    });
}