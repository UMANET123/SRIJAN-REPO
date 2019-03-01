
const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { clientID }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { verifyOTP } } = require("../config/environment")

var request = require('request');
var generate_key = function () {
    var sha = crypto.createHash('sha256');
    sha.update(Math.random().toString());
    return sha.digest('hex');
};
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
        var res_data = {}
        res_data.statusCode = response.statusCode
        if (response.statusCode == 201) {
            sess = req.session;
            body_data = JSON.parse(body)
            sess.sessionid = subscriber_id + body_data['expires_in']
            sess.access_token = body_data['access_token']
            sess.token_type = body_data['token_type']
            sess.expires_in = body_data['expires_in']
            sess.refresh_token = body_data['refresh_token']
            sess.refresh_token_expires_in = body_data['refresh_token_expires_in']
            sess.subscriber_id = subscriber_id
            req.session.save(function () {
                res.send(res_data)
            });
        }

        else if (response.statusCode == 403) {
            res_data.error_code = body_data.error_code
            res_data.error_message = body_data.error_message
        } else {

            res_data.error_message = 'Invalid OTP.'
            res.send(res_data)

        }

    });
}

