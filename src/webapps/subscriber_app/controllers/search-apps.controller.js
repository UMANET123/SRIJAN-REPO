
const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { clientID }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { verifyOTP } } = require("../config/environment")
const axios = require('axios')
var request = require('request');
var session = require("express-session")


