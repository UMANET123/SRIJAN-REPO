
const { NODE_SETTINGS, APIGEE_CREDS: { apigeeBaseURL }, APIGEE_CREDS: { clientID }, APIGEE_CREDS: { clientSecret }, APIGEE_ENDPOINTS: { verifyOTP } } = require("../config/environment")
const axios = require('axios')
var request = require('request');
var session = require("express-session")
function getConsentListing(){
    const getAppList = async () => {
		try {
			return axios.get('https://globeslingshot-dev-labs.apigee.net/dashboard/v1/consent', {
				params: {
					limit: '10',
					page: '0'
				},
				headers: {
					Authorization: 'Bearer JZbPxm522cUvHFbvAGDlCOeY5XZu',
					'cache-control': 'no-cache',
				}
			});
		} catch (error) {
			console.error(error)
		}
	}
}
