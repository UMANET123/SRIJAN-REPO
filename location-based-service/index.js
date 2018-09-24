// Imports
const express = require('express');
const xmlparser = require('express-xml-bodyparser');
const morgan = require('morgan');
// Setup
const app = express();
const port = process.env.PORT_NUMBER;

app.use(xmlparser());

// Add logic to manage verbosity in prod vs dev env
if (process.env.NODE_ENV == 'prod') {
    app.use(morgan('common')); // Less Verbose ( Uses Apache Style Logs <DATE> Log details)
} else {
    app.use(morgan('dev'));
}


// Middleware to ONLY accept POST requests
app.use((req, res, next) => {
    if (req.method != "POST") {
        res.sendStatus(405);
        return res.end();
    }
    next();
})

// Middleware to Check if Soap Contract is present in the request body
app.use((req, res, next) => {
    if (Object.keys(req.body).length == 0 && req.method == "POST") {
        res.sendStatus(400);
        return res.send();
    }
    next();
})

/**
 * MSISDN = Mobile Station International Subscriber Directory Number
 */
app.post('/', (req, res, next) => {

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

    /*
     ** Test if number is from the Philippines or not ( Regex )
     */
    if (!(/^639[0-9]{9}$/.test(msisdn))) {
        res.sendStatus(400);
        return res.send({
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