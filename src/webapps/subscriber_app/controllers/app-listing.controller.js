
const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { clientID }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { consentApps } } = require("../config/environment")
const axios = require('axios')
var request = require('request');
var session = require("express-session")

async function consentList(req, res, sub_access_token) {
    var { page, limit, appname } = req.query;
    if (!limit) limit = '10';
    // if (!page)  page = '0'; else page = parseInt(page) - 1;
    page = (!page)? '0':(parseInt(page)-1);
    var authorizationHeaderString = 'Bearer ' + sub_access_token;
    const response = await axios.get(`${apigeeBaseURL}/${consentApps}`, {
        params: {
            limit,
            page,
            appname
        },
        headers: {
            Authorization: authorizationHeaderString,
            'cache-control': 'no-cache',
        }
    })
        .then(function (response) {
            return response
        }).catch(function (error) {
            return error
        });
    return response.data;
}

module.exports = consentList


