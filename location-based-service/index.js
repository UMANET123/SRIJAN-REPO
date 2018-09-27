/**
 * Location Based Service Mock Micro Service
 * 
 * This service is written to mock the current location based service deployed at globe
 * 
 * This accepts soap contracts which it parses into json, picks out the required data and sends
 * back a soap contract
 */

/**
 * Dependencies :
 * 1. Express
 * 2. Xmlparser
 * 3. Morgan
 */
const express = require('express');
const xmlparser = require('express-xml-bodyparser');
const morgan = require('morgan');

const app = express();
const port = process.env.PORT_NUMBER || 5000;

/**
 * Middleware Xmlparser to parse XML into JSON
 * 
 * Soap Contracts are written in XML , which need to be parsed into json to work with
 */
app.use(xmlparser());

/**
 * This set's the level of logging based on the environment
 * 
 * Production = morgan('common') , Less Verbose ( Uses Apache Style Logs <DATE> Log Details)
 * Development = morgan('dev') More Verbose
 */
if (process.env.NODE_ENV == 'prod') {
    app.use(morgan('common'));
} else if (process.env.NODE_ENV == 'dev') {
    app.use(morgan('dev'));
}

/**
 * Middleware to check that only POST requests are allowed
 * 
 * Returns status 405
 */
app.use((req, res, next) => {
    if (req.method != "POST") {
        return res.status(405).send("Method Not Allowed");
    }
    next();
})

/**
 * Middleware to check the presence of the SOAP contract in the body
 * 
 * Returns status 400
 */
app.use((req, res, next) => {
    if (Object.keys(req.body).length == 0 && req.method == "POST") {
        return res.status(400).send("SOAP contract not present");
    }
    next();
})

/*
 * Handler to process SOAP contract and and return new SOAP contract
 * 
 * Accepts SOAP contract and returns a new SOAP contract
 * 
 * Validates MSISDN - Mobile Number if it belong to the Philippines or not
 * 
 * returns 200 for success
 * 
 * returns 400 in case the Number (msisdn) is not valid
 */
app.post('/locationManagement/monetization', (req, res, next) => {
    const body = req.body;
    const {
        "soap:envelope": {
            "soap:body": [{
                "loc:getlocationbymsisdn": [{
                    "msisdn": [msisdn]
                }]
            }]
        }
    } = body;

    /**
     * Regex to check if number belongs to the Philippines or not
     * 
     * Returns 400 if it fails, else continues
     */
    if (!(/^639[0-9]{9}$/.test(msisdn))) {
        return res.status(400).send({
            error: "MSISDN Invalid, does not belong to the Philippines"
        });
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
                </soap:Envelope>`;

    res.type('application/xml');
    res.send(data);
});

app.listen(port, () => {
    console.log("Starting Location Based Service");
    console.log(`Environment : ${process.env.NODE_ENV}`);
    console.log(`Port : ${port}`);
});

module.exports = app;