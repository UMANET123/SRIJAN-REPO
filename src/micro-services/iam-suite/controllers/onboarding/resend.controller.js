const cryptr = require('../../helpers/encryptdecrypt');
const user = require('../../models/user.model');

exports.post = function (req, res) {
    let email = req.body.email;
    let token = cryptr.encrypt(email)
    user.get(email, (err, data) => {
        if (data) {
            data = JSON.parse(data);
            if (!data.emailVerify) {
                user.setEmailToken(token, email);
                return res.status(201).send({
                    email: email,
                    hash: token
                });
            } else {
                return res.status(400).send({
                    message: 'Email Already Verified'
                });
            }
        } else {
            res.status(400).send({
                message: 'Invalid Request'
            })
        }
    })

}