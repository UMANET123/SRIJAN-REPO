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
    let email = req.body.email;
    let subject = req.body.subject;
    let text = req.body.text;
    var mailOptions = {
        from: `${SENDERS_NAME} <${SENDERS_EMAIL}>`, // sender address (who sends)
        to: `${email}`, // list of receivers (who receives)
        subject: `${subject}`, // Subject line
        text: `${text}`, // plaintext body
    };

    transporter.sendMail(mailOptions, function (error, info) {
        if (error) {
            return res.status(500).send({
                message: 'Internal Server Error'
            });
        }
        res.status(200).send({
            message: info.response
        });
    });
});

app.listen(PORT, () => {
    console.log(`App Running on PORT : ${PORT}`);
});