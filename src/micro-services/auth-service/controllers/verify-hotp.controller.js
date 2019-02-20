const identity = require('../models/otp.model');

module.exports = function (req, res) {
    let address = req.body.address ? req.body.address : req.body.email;
    let otp = req.body.otp
    identity.verifyHotp(address, otp, (status) => {
        if (status) {
            return res.send({
                status: "success"
            });
        } else {
            return res.send({
                status: "failed"
            });
        }
    })
}