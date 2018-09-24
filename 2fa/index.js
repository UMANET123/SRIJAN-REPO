/**
 * Two Factor Authetication Micro Service
 * 
 * This service generates an OTP based on the user's mobile number
 * Only Mobile Number's from the Philippines will be accepted
 * 
 */

/**
 * Dependencies : 
 * 1. Express
 * 2. Body Parser
 * 3. OPTLIB ( Library to Generate OTP's )
 */

const express = require('express');
const bodyParser = require('body-parser');
const optlib = require('otplib');
const app = express();

/**
 * Middleware to parse response body into JSON
 */
app.use(bodyParser.json());

/**
 * Middleware to check if the number belongs to the Philippines 0r not
 * 
 * Return 400 if number does not belong to the Philippines along with Error message
 */
app.use((req, res, next) => {
    if (!(/^639[0-9]{9}$/.test(req.body.msisdn))) {
        return res.status(400).send({
            error: "MSISDN Invalid, does not belong to the Philippines"
        });
    }
    next();
})

/**
 * PORT_NUMBER = Broadcast Port number picked up from ENV variables
 * NODE_ENV = Node Environment picked up from ENV Variables
 */
const PORT_NUMBER = process.env.PORT_NUMBER;
const NODE_ENV = process.env.NODE_ENV;

/**
 * Generates a secret for OTPLIB
 */
const secret = optlib.authenticator.generateSecret();


/**
 * Handler to Generate an OTP from a mobile number
 * 
 * Required params :
 * msisdn = Mobile number
 * 
 * Returns : 
 * otp = One Time Password Generate
 * msisdn = Mobile number for which the password was generated
 * 
 * The msisdn is appended to the secret while supplying it the generate fuction
 * which generates the OTP
 * 
 * NOTE:
 * Every OTP generated has a lifespan of 30 seconds
 */
app.post('/generate', (req, res) => {
    let msisdn = req.body.msisdn;
    let otp = optlib.totp.generate(secret + msisdn, {
        step: 1,
        epoch: Math.floor(new Date() / 1000)
    })
    res.send({
        otp: otp,
        msisdn: msisdn
    });
});

/**
 * Handler to Verify The Generated OTP
 * 
 * Required Params : 
 * msisdn = Mobile Number
 * otp = One Time Password for verification
 * 
 * Return :
 *  If the OTP is valid :
 *      {opt: "12345", msisdn: "6931234567", accepted: true}
 *  
 * If the OTP is Invalid :
 *      {error: "The OTP has expired, please request for a new one"}
 * 
 */
app.post('/verify', (req, res) => {
    let msisdn = req.body.msisdn;
    let otp = req.query.otp;
    let verify = optlib.totp.verify({
        token: otp,
        secret: secret + msisdn
    })
    if (verify) {
        res.send({
            opt: otp,
            msisdn: msisdn,
            accepted: verify
        });
    } else {
        res.status(400).send({
            error: "The OTP has expired, please request for a new one"
        });
    }

});


app.listen(PORT_NUMBER, () => {
    console.log("Started 2FA Server");
    console.log(`PORT : ${PORT_NUMBER}`);
    console.log(`ENV : ${NODE_ENV}`);
});

/**
 * Exporting app for use in test
 */
module.exports = app