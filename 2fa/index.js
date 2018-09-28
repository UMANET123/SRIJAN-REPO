/**
 * Two Factor Authetication Micro Service
 * 
 * This service generates an OTP based on the user's mobile number
 * Only Mobile Number's from the Philippines will be accepted
 * An Email will be sent to the respective user with the generate OTP for verification
 * 
 */

/**
 * Dependencies : 
 * 1. Express
 * 2. Body Parser ( Library to Parse Body )
 * 3. otplib ( Library to Generate OTP's )
 * 4. nodemailer ( Library to Send Emails )
 * 5. morgan ( Library to Manage Logs )
 * 
 * Rest of the libs are fs and path which are node core modules
 */

const express = require('express');
const bodyParser = require('body-parser');
const otplib = require('otplib');
const nodemailer = require('nodemailer');
const morgan = require('morgan');
const path = require('path');
const fs = require('fs');
const qrcode = require('qrcode');
const app = express();


/**
 * PORT_NUMBER = Broadcast Port number picked up from ENV variables
 * NODE_ENV = Node Environment picked up from ENV Variables
 * OTP_TIMER = OTP Alive time, set in minutes default is 5 minutes
 * OTP_STEP = OTP_STEP x OTP_TIMER = Alive time, hence default is 60 seconds
 * EMAIL_USERNAME = Email ID from which the email is to be sent from
 * EMAIL_PASSWORD = Email Password of the email from which the email is sent
 */
const PORT_NUMBER = process.env.PORT_NUMBER || 3000;
const NODE_ENV = process.env.NODE_ENV || 'dev';
const OTP_TIMER = process.env.OTP_TIMER || 5
const OTP_STEP = parseInt(process.env.OTP_STEP) || 60
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;

/**
 * This block creates a directory in the container which saves the logs
 * This is ignored during tests
 */
if (NODE_ENV != 'test') {
    var logDirectory = path.join('/var/log/', '2fa');
    fs.existsSync(logDirectory) || fs.mkdirSync(logDirectory)
}

/**
 * This Block sets the level of logging for different environments
 * 
 * The Two Environments here, develop and production will have different log files generated
 * based on the environment
 * 
 * production = morgan('common') this generates apache style logs and is less verbose
 * development = morgan('dev') this generates much more verbose logs
 * 
 */
if (NODE_ENV == 'prod') {
    var accessLogStream = fs.createWriteStream(path.join(logDirectory, 'production.log'), {
        flags: 'a'
    })
    app.use(morgan('common', {
        stream: accessLogStream
    }));
} else if (NODE_ENV == 'dev') {
    var accessLogStream = fs.createWriteStream(path.join(logDirectory, 'development.log'), {
        flags: 'a'
    })
    app.use(morgan('dev', {
        stream: accessLogStream
    }));
}

/**
 * Mailer SMTP Setup
 * 
 * This creates a transporter instance to save all the email server configs
 * The EMAIL_USERNAME, EMAIL_PASSWORD, EMAIL_HOST, EMAIL_PORT 
 * are variables picked up from the Environment
 */
var transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true, // use SSL
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
});


/**
 * Middleware to parse response body into JSON
 */
app.use(bodyParser.json());

/**
 * Middleware to check if the methods are only POST
 * 
 * Will return status 405 if the request is anything but POST
 */

app.use((req, res, next) => {
    if (req.method != "POST") {
        return res.status(405).send({
            error: "Method not allowed"
        })
    }
    next();
})

/**
 * Middleware to check if the number belongs to the Philippines or not
 * Also check if the Number(address) is present or not
 * 
 * Return 400 if number does not belong to the Philippines along with Error message
 * Return 400 if number is not present
 */
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
 * Generates a secret for the OTP
 */
const secret = otplib.authenticator.generateSecret();

/**
 * Handler to Generate an OTP from a mobile number
 * 
 * Required params :
 * address = Mobile number
 * 
 * Optional params :
 * email= Emaill address to send the OTP to
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
 * If email is provided, the email with the OTP will be send to the email address provided
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
            from: 'GLOBE TELECOM <valindo.godinho@zoho.com>', // sender address (who sends)
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
 * Returns with status 200 :
 *  If the OTP is valid :
 *      {status: "success"}
 *  
 * If the OTP is Invalid :
 *      {status: "failed"}
 * 
 * Returns with status 400 :
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


app.post('/generate/hotp', (req, res) => {

    let address = req.body.address;
    let addressSecret = otplib.authenticator.encode(`${address}`)
    let email = req.body.email;
    let otpurl = otplib.authenticator.keyuri(address, '2fa', addressSecret)
    console.log(otpurl);
    let base64 = qrcode.toDataURL(otpurl, (error, base64) => {
        if (error) {
            return error
        } else {
            let preview = `<p><img src="${base64}"/></p>`
            res.writeHead(200, {
                'Content-Type': 'html',
            });
            return res.end(preview);
        }
    });
})

app.post('/verify/hotp', (req, res) => {
    let address = req.body.address;
    let addressSecret = otplib.authenticator.encode(`${address}`)
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

    let verify = otplib.authenticator.verify({
        token: otp,
        secret: addressSecret,
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

})

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