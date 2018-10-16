const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const app = express();

app.use(bodyParser.json());

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

app.post('/sendmail', (req, res) => {
    let to = req.body.to;
    let subject = req.body.subject;
    let from = req.body.from || SENDERS_EMAIL;
    let fromName = req.body.fromName || SENDERS_NAME;
    let body = req.body.body;
    var mailOptions = {
        from: `${fromName} <${from}>`, // sender address (who sends)
        to: to, // list of receivers (who receives)
        subject: subject, // Subject line
        html: body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            console.error(error);
        } else {
            console.log(info)
        }
    });
    res.status(202).send({
        message: "Request Accepted"
    });
});

app.listen(PORT, () => {
    console.log(`App Running on PORT : ${PORT}`);
});