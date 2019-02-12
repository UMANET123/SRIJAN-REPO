const identity = require('../models/identity.model');
module.exports = function (req, res) {
let {subscriber_id, otp, app_id} = req.body;
if (!subscriber_id || !otp || !app_id) return res.status(400).send({
    "error_code": "BadRequest",
    "error_message": "Bad Request"
  });
identity.verifyTOtp(req.body, (response, status) => {
        return res.status(status).send(response);
    });
}