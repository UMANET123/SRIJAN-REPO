const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { clientID }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { updateConsent } } = require("../config/environment")

var request = require('request');
var session = require("express-session")
module.exports = function (req, res, next) {
    let subscriber_id = req.body.subscriber_id
    console.log(subscriber_id)
    let scopes = req.body.scopes
    var encodedData = Buffer.from(clientID + ':' + clientSecret).toString('base64');
    var authorizationHeaderString = 'Basic ' + encodedData;
    console.log(authorizationHeaderString);
    var options = {
        method: 'POST',
        url: `${apigeeBaseURL}/${updateConsent}`,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: authorizationHeaderString,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: {
            subscriber_id: 'ff64a3e970d5252f9cde8c4c3bfd1a5f',
            subscriber_consent: '["LOCATION"]',
            response_type: 'code',
            redirect_uri: 'http://13.232.77.36:5560'

        }
    };
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(response.statusCode)

        var res_data = {}
        res_data.statusCode = response.statusCode
        // if (response.statusCode == 302) {
        //      res_data.message = 'Success.'
        //      res_data.redirect = response.headers.location
        // }
        // else {
        //      res_data.error_message = 'Invalid OTP.'
        //  }
        console.log(body)
        res.send(res_data)

    });
}
