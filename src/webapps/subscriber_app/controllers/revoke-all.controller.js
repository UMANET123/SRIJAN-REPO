

const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { revokeAllApps } } = require("../config/environment")

var request = require('request');
var session = require("express-session")
module.exports = function (req, res, next) {
    session = req.session
    let sub_access_token = session.access_token
    let subscriber_id = session.subscriber_id

    //  var encodedData = Buffer.from(clientID + ':' + clientSecret).toString('base64');

    // var authorizationHeaderString = 'Basic ' + encodedData;
    var authorizationHeaderString = 'Bearer ' + sub_access_token;
    console.log(authorizationHeaderString);
    var options = {
        method: 'DELETE',
        url: `${apigeeBaseURL}/${revokeAllApps}`,
        headers:
        {
            'cache-control': 'no-cache',
            Authorization: authorizationHeaderString,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        qs:
        {
            subscriber_id: subscriber_id
        },
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


