const emailValidator = require('../../helpers/email.validator');
const cryptr = require('../../helpers/encryptdecrypt');
const user = require('../../models/user.model');

exports.post = function (req, res) {
    let email = req.body.email;
    let password = req.body.password;

    if (!emailValidator(email)) {
        return res.status(400).send({
            message: "Invalid Email Address"
        });
    }

    if (password.length < 6) {
        return res.status(400).send({
            message: "Invalid Password"
        });
    }
    encryptedPassword = cryptr.encrypt(password);
    user.get(email, (err, data) => {
        if (!err) {
            data = JSON.parse(data);
            if (data.emailVerify) {
                if (password == cryptr.decrypt(data.password)) {
                    console.log("Step 2");
                    return res.status(200).send({
                        message: "Successfully Logged in"
                    });
                }
            } else {
                return res.status(401).send({
                    message: "Please Verify your email"
                });
            }
        } else {
            return res.status(401).send({
                message: "Invalid credentials"
            })
        }
    })
}