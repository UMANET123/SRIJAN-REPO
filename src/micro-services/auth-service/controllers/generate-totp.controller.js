const {generateTOtp} = require('../models/otp.model');
const subscriberNumber = require('../helpers/subscriber');

module.exports = function (req, res) {
    let {app_id, msisdn, blacklist} = req.body;
    //  check for  {app_id, msisdn, blacklist} exists
    if (! app_id || ! msisdn || typeof(blacklist) != "boolean") return res.status(400).send({
        "error_code": "BadRequest",
        "error_message": "Bad Request"
      });
    //   validate the number as per Philippines 
    let isValidNumber = subscriberNumber.getTelco(msisdn);
    if (! isValidNumber.valid || isValidNumber.telco !== 'globe' ) {
        return res.status(400).send({
            "error_code": "BadRequest",
            "error_message": "Bad Request"
          });
    }
    //  generate otp
    generateTOtp(msisdn, app_id, blacklist , (...args)=>{
        let [otp, secret, status ] = args;
        console.log({otp, secret, status});
        //  is app blacklisted
        if (status === 403) {
            res.status(403).send({
                "error_code": "Forbidden",
                "error_message": "App is blacklisted"
              });
        }
        //  response success
        res.status(status).send({
            subscriber_id: secret,
            otp: otp, 
            app_id: app_id
        });
    });
  
}