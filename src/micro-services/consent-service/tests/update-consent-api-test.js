// const chai = require('chai');
// const chaiHTTP = require('chai-http');
// const app = require('../app');
// const {expect} = chai;
// chai.use(chaiHTTP);

// const endpoint = `/consent`;

// let chaiApiCall = ({app, endpoint, type='application/json', data}, callback ) => {
//     chai.request(app)
//     .put(endpoint)
//     .type(type)
//     .send(data)
//     .end(callback);
// };

// let data = JSON.stringify({
//     "subscriber_id": "a0040a18-e227-4bca-b5aa-452c7ae03165",
//     "app_id": "e2274bcab5aa452c7ae03165",
//     "developer_id": "a0040a18e227",
//     "scopes": [
//       "sms",
//       "location"
//     ],
//     "access_token": "FnyqFzJKZ5hrSB9JARCSpt90tgPNsdsd",
//     "appname": "Weather App"
//   });

//   describe('Testing Update Consent API Response', () => {
//     describe(`Testing Api endpoint Response ${endpoint}`, () => {
//         it(`Should Return Response Code 200 for update consent PUT`, () => {
//                 chaiApiCall({app, endpoint, data }, (err, res) => {
//                     console.log({res: res.status});
//                     expect(res.status).to.equal(200);
//                 });

//         });
//         it('Response body should have theses properties with value to create consent PUT', () => {
//                 chaiApiCall({app, endpoint, data }, (err, res) => {
//                      expect(res.body).to.have.members(['old_token', 'old_token_value']);
//                      expect(res.body).to.have.property('old_token', true);
//                      expect(res.body.old_token_value).to.not.equal('');
//                 });
//         });

//     });
//     describe(`Testing endpoint Request ${endpoint}`, () => {

//         it('Should Reject for Invalid Request Payload with status code 400', () => {
//             chaiApiCall({app, endpoint, data: JSON.stringify({
//                 abcd: 4567891
//             }) }, (err, res) => {
//                 chai.expect(res.status).to.equal(400);
//             });
//         });

//     });

// });
