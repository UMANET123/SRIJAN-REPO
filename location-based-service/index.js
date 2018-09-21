// Imports
const express = require('express');
const xmlparser = require('express-xml-bodyparser');
const morgan = require('morgan');
// Setup
const app = express();
const port = process.env.PORT_NUMBER;

app.use(xmlparser());

// Logger
if (process.env.NODE_ENV == 'prod') {
    console.log('I Am in Prod');
    app.use(morgan('common')); // Add Logic to maintain a logfile in the prod server
} else {
    console.log('I Am in Dev');
    app.use(morgan('dev'));
}


// Middleware to only accept POST requests
app.use((req, res, next) => {
    if (req.method != "POST") {
        res.sendStatus(405)
        res.end();
    }
    next();
})

// Middleware to Check if Soap Contract is present
app.use((req, res, next) => {
    if (Object.keys(req.body).length == 0 && req.method == "POST") {
        res.sendStatus(400)
        return res.send()
    }
    next();
})

app.post('/', (req, res, next) => {

    const body = req.body
    const {
        "soap:envelope": {
            "soap:body": [{
                "loc:getlocationbymsisdn": [{
                    "csp_txid": [txid],
                    "cp_id": [cpid],
                    "cp_userid": [cpuserid],
                    "cp_password": [cppassword],
                    "serviceid": [serviceid],
                    "productid": [productid],
                    "msisdn": [msisdn]
                }]
            }]
        }
    } = body;



    if (!(/^639[0-9]{9}$/.test(msisdn))) {
        res.sendStatus(400);
        return res.send();
    }
    let data = `<soap:Envelope
    xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
    xmlns:head="http://www.globe.com/warcraft/wsdl/header/"
    xmlns:loc="http://www.globe.com/warcraft/wsdl/locationmgt/">
    <soap:Header>
        <head:WarcraftHeader>
            <!--Optional:-->
            <EsbMessageID>12345678</EsbMessageID>
            <!--Optional:-->
            <EsbRequestDateTime>1234567890</EsbRequestDateTime>
            <!--Optional:-->
            <EsbResponseDateTime>${Date.now()}</EsbResponseDateTime>
            <!--Optional:-->
            <EsbIMLNumber>123456789</EsbIMLNumber>
            <!--Optional:-->
            <EsbOperationName>1234567890</EsbOperationName>
        </head:WarcraftHeader>
    </soap:Header>
    <soap:Body>
        <loc:GetLocationByMSISDNResponse>
            <!--Optional:-->
            <GetLocationByMSISDNResult>
                <!--Optional:-->
                <MSISDN>${msisdn}</MSISDN>
                <!--Optional:-->
                <Latitude>1234567890</Latitude>
                <!--Optional:-->
                <Longitude>1234567890</Longitude>
            </GetLocationByMSISDNResult>
        </loc:GetLocationByMSISDNResponse>
    </soap:Body>
</soap:Envelope>`
    res.type('application/xml')
    res.send(data)
});

app.listen(port, () => {
    console.log(`Broadcasting on Port : ${port}`);
});

module.exports = app;