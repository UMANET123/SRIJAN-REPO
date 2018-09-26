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
const nodemailer = require('nodemailer');
const app = express();

/**
 * Mailer SMTP Setup
 * 
 * This creates a transporter instance to save all the email server configs
 */
var transporter = nodemailer.createTransport({
    host: 'smtp.zoho.com', // Pick host from the environment
    port: 465, // pick port from the environment
    secure: true, // use SSL
    auth: {
        user: 'valindo.godinho@zoho.com', // pick email from the environment
        pass: 'p.hf2!P3yQfp7nX' // pick password from the environment
    }
});


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
    if (req.method != "POST") {
        return res.status(405).send({
            error: "Method not allowed"
        })
    }
    next();
})

app.use((req, res, next) => {
    if (!req.body.address) {
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
 * OTP_TIMER = OTP Alive time, set in minutes default is 5 minutes
 * OTP_STEP = OTP_STEP x OTP_TIMER = Alive time, hence default is 60 seconds
 */
const PORT_NUMBER = process.env.PORT_NUMBER || 5000;
const NODE_ENV = process.env.NODE_ENV || 'dev';
const OTP_TIMER = process.env.OTP_TIMER || 5
const OTP_STEP = parseInt(process.env.OTP_STEP) || 60
/**
 * Generates a secret for OTPLIB
 */
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
    otplib.totp.options = {
        step: OTP_STEP,
        window: OTP_TIMER
    }
    let otp = otplib.totp.generate(secret + address);
    if (email) {
        /**
         * Block to send email if email address is present
         * 
         * mailOptions stores the template of the email along with sender and reciever information
         * 
         * transporter.sendMail(mailOptions, callback) send's the email and waits to recieve a
         * confirmation message
         */
        var mailOptions = {
            from: '<valindo.godinho@zoho.com>', // sender address (who sends)
            to: `${email}`, // list of receivers (who receives)
            subject: 'OTP', // Subject line
            text: `${otp}`, // plaintext body
            html: `<h3>${otp}</h3><p>is the OTP for the number ${address}</p><br/><p>This OTP is valid only for ${OTP_TIMER} mins` // html body
        };

        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                return console.log(error);
            }
            console.log('Message sent: ' + info.response);
        });
    }
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
    if (!otp) {
        return res.status(400).send({
            error: "OTP is not present"
        });
    }
    if (otp.length != 6) {
        return res.status(400).send({
            error: "OTP length Mismatch"
        });
    }
    if (!/^\d+$/.test(otp)) {
        return res.status(400).send({
            error: "OTP should be numbers only"
        });
    }
    let verify = otplib.totp.verify({
        token: otp,
        secret: secret + address,
    });
    if (verify) {
        return res.send({
            status: "success"
        });
    } else {
        return res.send({
            status: "failed"
        });
    }

});

/**
 * Custom Error Handler for 500 Response
 * 
 * Returns : 
 *      {error: "Internal Server Error"}
 */
app.use(function (err, req, res, next) {
    console.error(err.stack);
    res.status(500).send({
        error: "Internal Server Error"
    });
})


app.listen(PORT_NUMBER, () => {
    console.log("Started 2FA Server");
    console.log(`PORT : ${PORT_NUMBER}`);
    console.log(`ENV : ${NODE_ENV}`);
    console.log(`OTP ALIVE TIME : ${OTP_TIMER}m`);
});

/**
 * Exporting app for use in test
 */
module.exports = app;