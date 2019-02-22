
const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { blacklist }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { verifyOTP } } = require("../config/environment")

var request = require('request');
var session = require("express-session")
module.exports = function (req, res, next) {
    let { app_id, otp, subscriber_id } = req.body;
    let sub_access_token = session.access_token
    let otp = req.body.otp;
    //  var encodedData = Buffer.from(clientID + ':' + clientSecret).toString('base64');
    let app_id = req.body.app_id
    // var authorizationHeaderString = 'Basic ' + encodedData;
    var authorizationHeaderString = 'Basic ' + sub_access_token;
    console.log(authorizationHeaderString);
    var options = {
        method: 'DELETE',
        url: `${apigeeBaseURL}/${blacklist}/${app_id}`,
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
        if (response.statusCode == 200) {

            res_data.status = response.body.status

        }
        else {
            res_data.error_message = 'There are some error during perform operations.'
        }
        res.send(res_data)

    });

}

