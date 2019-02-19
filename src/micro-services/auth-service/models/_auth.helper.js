
require('dotenv').config();
const fetch = require('node-fetch');


async function  checkBlackListApp({msisdn, app_id}) {

    let consent_base_url= process.env.CONSENT_SERVICE_BASEPATH;
    // get uuid from msisdn
    let uuidPromise = await getSubscriberId(msisdn);
    console.log({uuidPromise});
    await fetch(`${consent_base_url}/blacklist/:subscriber_id/${app_id}`);

}

async function getSubscriberId (msisdn) {
    let verifyUserApi= `${process.env.AUTH_SERVICE_BASEPATH}/verify/user`;
    let options =  {    method: 'POST',
                        body: JSON.stringify( {
                            phone_no: msisdn
                        }),
                        headers: { 'Content-Type': 'application/json' }
                    }
     return await fetch(verifyUserApi, options);
}


module.exports = { checkBlackListApp, getSubscriberId};