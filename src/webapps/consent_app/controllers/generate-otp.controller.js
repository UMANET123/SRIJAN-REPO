
const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { clientID }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { generateOTP } } = require("../config/environment")

var request = require('request');
module.exports = function (req, res, next) {
    var subscribers = [];
    let phone_no = req.body.phone_no;
    let client_id = req.body.client_id
   // var encodedData = Buffer.from(clientID + ':' + clientSecret).toString('base64');
   // var authorizationHeaderString = 'Basic ' + encodedData;
  //  console.log(authorizationHeaderString);
    var options = {
        method: 'POST',
        url: `${apigeeBaseURL}/${generateOTP}`,
        headers:
        {
            'cache-control': 'no-cache',
         //   Authorization: authorizationHeaderString,
            'Content-Type': 'application/x-www-form-urlencoded'
        },
        form: { msisdn: phone_no },
        qs: { client_id: client_id },
    };

    request(options, function (error, response, body) {
        if (error) throw new Error(error);
        var res_data = {}
        console.log(body)
        body_data = JSON.parse(body)  
        res_data.statusCode = response.statusCode
        if (response.statusCode == 201) {
            res_data.message = 'OTP has send to your mobile successfully.'
            res_data.subscriber_id = body_data['subscriber_id']
            res_data.otp = body_data['otp']
            
        }
        else {
            res_data.error_code = body_data.error_code
            res_data.error_message = 'Kindly check the phone no.'
        }
        console.log(res_data)
        res.send(res_data)
        console.log(response.statusCode)
    });
}

