const {generateTOtp} = require('../models/identity.model');

module.exports = function (req, res) {
    let {app_id, msisdn, blacklist} = req.body;
    console.log(req.body);
    if (! app_id || ! msisdn || typeof(blacklist) != "boolean") return res.status(400).send({
        "error_code": "BadRequest",
        "error_message": "Bad Request"
      });
    generateTOtp(msisdn, app_id, blacklist , (...args)=>{
        let [otp, secret, status ] = args;
        console.log({otp, secret, status});
        if (status === 403) {
            res.status(403).send({
                "error_code": "Forbidden",
                "error_message": "App is blacklisted"
              });
        }
        res.status(status).send({
            subscriber_id: secret,
            otp: otp, 
            app_id: app_id
        });
    });
  
}