const cryptr = require('../../helpers/encryptdecrypt');
const user = require('../../models/user.model');

exports.post = function (req, res) {
    let email = req.body.email;
    let token = cryptr.encrypt(email)
    user.setEmailToken(token, email);
    return res.status(201).send({
        email: email,
        hash: token
    });
}