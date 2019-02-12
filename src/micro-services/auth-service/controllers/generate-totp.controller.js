const {generateTOtp} = require('../models/identity.model');

module.exports = function (req, res) {
    let {app_id, msisdn} = req.body;
    if (!app_id || !msisdn) return res.status(400).send({
        "error_code": "BadRequest",
        "error_message": "Bad Request"
      });
    generateTOtp(msisdn, app_id , (otp, secret, status)=>{
        res.status(status).send({
            otp: otp, 
            subscriber_id: secret
        });
    });
  
}