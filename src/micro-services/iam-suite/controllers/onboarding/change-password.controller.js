const cryptr = require('../../helpers/encryptdecrypt');
const user = require('../../models/user.model');

exports.put = function (req, res) {
    let email = req.body.email;
    let oldPassword = req.body.old_password;
    let newPassword = req.body.new_password;

    user.get(email, (err, data) => {
        if (data) {
            data = JSON.parse(data);
            oldPassword = cryptr.generateHash(oldPassword);
            if (oldPassword == data.password) {
                data.password = cryptr.generateHash(newPassword);
                user.update(email, JSON.stringify(data));
                return res.status(200).send({
                    message: "success"
                });
            }
        }
        return res.status(400).send({
            error: "Invalid credentials"
        });

    });
}