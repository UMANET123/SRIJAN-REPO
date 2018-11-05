const cryptr = require('../../helpers/encryptdecrypt');
const user = require('../../models/user.model');

exports.put = function (req, res) {
    let email = req.body.email;
    let newPassword = req.body.new_password;

    user.get(email, (err, data) => {
        if (data) {
            data = JSON.parse(data);
            data.password = cryptr.generateHash(newPassword)
            user.update(email, JSON.stringify(data));
            res.status(200).send({
                message: 'success'
            })
        } else {
            res.status(400).send({
                error: 'Bad Request'
            });
        }
    });
}