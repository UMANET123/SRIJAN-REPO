const {generateTOtp, generateTOTP} = require('../models/otp.model');
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
    // generateTOTP()
    generateTOtp(msisdn, app_id, blacklist , (responseBody, status)=>{
        return res.status(status).send(responseBody)
    });
  
}