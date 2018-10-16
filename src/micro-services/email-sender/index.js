const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

app.use(bodyParser.json());

const NODE_ENV = process.env.NODE_ENV;
const PORT = process.env.PORT;
const SENDERS_EMAIL = process.env.SENDERS_EMAIL;
const SENDERS_NAME = process.env.SENDERS_NAME;
const EMAIL_USERNAME = process.env.EMAIL_USERNAME;
const EMAIL_PASSWORD = process.env.EMAIL_PASSWORD;
const EMAIL_HOST = process.env.EMAIL_HOST;
const EMAIL_PORT = process.env.EMAIL_PORT;

var transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT,
    secure: true, // use SSL
    auth: {
        user: EMAIL_USERNAME,
        pass: EMAIL_PASSWORD
    }
});


app.use((req, res, next) => {
    if (req.method != "POST") {
        return res.status(405).send({
            error: "Method not allowed"
        });
    }
    next();
});

app.post('/sendmail', (req, res) => {
    let to = req.body.to;
    let subject = req.body.subject;
    let from = req.body.from || SENDERS_EMAIL;
    let fromName = req.body.fromName || SENDERS_NAME;
    let body = req.body.body;
    if (!(checkEmailAddress(to) && checkEmailAddress(from))) {
        return res.status(400).send({
            message: "Invalid Email Address"
        });
    }
    if (body.length == 0) {
        return res.status(400).send({
            message: "Invalid Email body"
        });
    }
    var mailOptions = {
        from: `${fromName} <${from}>`, // sender address (who sends)
        to: to, // list of receivers (who receives)
        subject: subject, // Subject line
        html: body
    };
    if (NODE_ENV != 'test') {
        transporter.sendMail(mailOptions, function (error, info) {
            if (error) {
                console.error(error);
            } else {
                console.log(info)
            }
        });
    }
    res.status(202).send({
        message: "Request Accepted"
    });
});

function checkEmailAddress(email) {
    let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
    return pattern.test(email);
};

app.listen(PORT, () => {
    console.log(`App Running on PORT : ${PORT}`);
});

module.exports = app;