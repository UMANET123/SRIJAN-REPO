
const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { clientID }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { blacklist } } = require("../config/environment")

var request = require('request');
var session = require("express-session")
module.exports = function (req, res, next) {
    // console.log(req.body)
    let { app_id, developer_id } = req.body;
    console.log({ app_id }, { developer_id }, {session});

    let subscriber_id = session.subscriber_id
    sess = req.session;
    let sub_access_token = sess.access_token
    // var authorizationHeaderString = 'Basic ' + encodedData;
    var authorizationHeaderString = 'Bearer ' + sub_access_token;
    console.log(authorizationHeaderString);
    var options = {
        method: 'DELETE',
        url: `${apigeeBaseURL}/${blacklist}`,
        headers:
        {
            'cache-control': 'no-cache',
             Authorization: authorizationHeaderString,
            'Content-Type': 'application/json'
        },
        qs:
        {
            app_id,
            developer_id,
            subscriber_id
        },
    };
    console.log(options)
    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        console.log(response.statusCode)
        console.log()

        var res_data = {}
        sess = req.session
        res_data.statusCode = response.statusCode
        console.log(response.body)
        if (response.statusCode == 200) {

            res_data.status = response.body.status
            sess.message = "App has been successfully revoked."
        }
        else {
            res_data.error_message = 'There are some error during perform operations.'
        }
        res.send(res_data)

    });

}


