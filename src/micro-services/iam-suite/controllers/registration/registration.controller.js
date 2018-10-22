const emailValidator = require('../../helpers/email.validator');
const mobileNumberValidator = require('../../helpers/mobile.validator');
const user = require('../../models/user.model');

exports.post = function (req, res) {
    let email = req.body.email;
    let password = req.body.password;
    let msisdn = req.body.msisdn;
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

    if (!mobileNumberValidator(msisdn)) {
        return res.status(400).send({
            message: "Invalid Mobile Number"
        });
    }
    user.get(email, (err, value) => {
        if (!value) {
            user.create(req.body, (contents) => {
                return res.status(201).send(contents);
            })
        } else {
            return res.status(409).send({
                message: 'Email Address already registered'
            });
        }
    })


}