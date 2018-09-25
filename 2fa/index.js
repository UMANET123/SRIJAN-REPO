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
 * 3. otplib ( Library to Generate OTP's )
 */

const express = require('express');
const bodyParser = require('body-parser');
const otplib = require('otplib');
const otpcore = require('otplib/core');
const app = express();

/**
 * Middleware to parse response body into JSON
 */
app.use(bodyParser.json());

/**
 * Middleware to check if the number belongs to the Philippines 0r not
 * Also check if the Number(address) is present or not
 * 
 * Return 400 if number does not belong to the Philippines along with Error message
 * Return 400 if number is not present
 */
app.use((req, res, next) => {
    if(!req.body.address){
        return res.status(400).send({
            error: "Address Not present"
        })
    }
    if (!(/^639[0-9]{9}$/.test(req.body.address))) {
        return res.status(400).send({
            error: "Address Invalid, does not belong to the Philippines"
        });
    }

    next();
})

/**
 * PORT_NUMBER = Broadcast Port number picked up from ENV variables
 * NODE_ENV = Node Environment picked up from ENV Variables
 */
const PORT_NUMBER = process.env.PORT_NUMBER || 5000;
const NODE_ENV = process.env.NODE_ENV || 'dev';

/**
 * Generates a secret for OTPLIB
 */
console.log()
const secret = otplib.authenticator.generateSecret();
/**
 * Handler to Generate an OTP from a mobile number
 * 
 * Required params :
 * address = Mobile number
 * 
 * Returns : 
 * otp = One Time Password Generate
 * address = Mobile number for which the password was generated
 * 
 * The address is appended to the secret while supplying it the generate fuction
 * which generates the OTP
 * 
 * NOTE:
 * Every OTP generated has a lifespan of 300 seconds
 * 
 * To Calculate the OTP time step x window = expirationTime (seconds)
 */
app.post('/generate', (req, res) => {
    let address = req.body.address;
    let email = req.body.email;
    otplib.totp.options = {step:60, window:5}
    let otp = otplib.totp.generate(secret + address);
    res.status(201).send({
        otp: otp,
        address: address
    });
});

/**
 * Handler to Verify The Generated OTP
 * 
 * Required Params : 
 * address = Mobile Number
 * otp = One Time Password for verification
 * 
 * Return :
 *  If the OTP is valid :
 *      {opt: "12345", address: "6931234567", accepted: true}
 *  
 * If the OTP is Invalid :
 *      {error: "The OTP has expired, please request for a new one"}
 * 
 * If the OTP is not present : 
 *      {error: "OTP is not present"}
 * 
 * If the OTP is not a number :
 *      {error: "OTP should be numbers only"}
 * 
 * If the OTP length is not 6 : 
 *      {error: "OTP length Mismatch"}
 */
app.post('/verify', (req, res) => {
    let address = req.body.address;
    let otp = req.body.otp;
    if(!otp){
        return res.status(400).send({
            error: "OTP is not present"
        });
    }
    if(otp.length != 6){
        res.status(400).send({
            error: "OTP length Mismatch"
        });
    }
    if(isNaN(Int(otp.length))){
        res.status(400).send({
            error: "OTP should be numbers only"
        });
    }
    let verify = otplib.totp.verify({
        token: otp,
        secret: secret + address,
    });
    if (verify) {
        res.send({
            status: "success"
        });
    } else {
        res.send({
            status: "failed"
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
module.exports = app;