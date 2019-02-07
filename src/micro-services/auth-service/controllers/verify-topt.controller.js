const identity = require('../models/identity.model');
module.exports = function (req, res) {
    let address = req.body.address ? req.body.address : req.body.email;
    let {otp, app_id, developer_id} = req.body;

    identity.verifyTOtp(address, otp,app_id, developer_id, (status) => {
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