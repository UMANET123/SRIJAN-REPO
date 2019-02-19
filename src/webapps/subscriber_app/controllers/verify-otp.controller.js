
const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { clientID }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { verifyOTP } } = require("../config/environment")

var request = require('request');
var session = require("express-session")
module.exports = function (req, res, next) {

    let subscriber_id = req.body.subscriber_id;
    let otp = req.body.otp;

    var encodedData = Buffer.from(clientID + ':' + clientSecret).toString('base64');
    var authorizationHeaderString = 'Basic ' + encodedData;
    console.log(authorizationHeaderString);
    var options = {
        method: 'POST',
        url: `${apigeeBaseURL}/${verifyOTP}`,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: authorizationHeaderString,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: { subscriber_id: subscriber_id, otp: otp }
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(response.statusCode)
        console.log()

        var res_data = {} 
        res_data.statusCode = response.statusCode
        console.log(response.body)
        if (response.statusCode == 201) {
             sess = req.session;
             sess.sessionid = subscriber_id
             sess.access_token = response.body.access_token
             sess.token_type = response.body.token_type
             sess.expires_in = response.body.expires_in
             sess.refresh_token = response.body.refresh_token
             sess.refresh_token_expires_in = response.body.refresh_token_expires_in
             sess.subscriber_id = subscriber_id
             console.log(subscriber_id)
        }
        else {
             
             res_data.error_message = 'Invalid OTP.'
         }
        res.send(res_data)
        
    });
}

