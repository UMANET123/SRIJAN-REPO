// const chai = require("chai");
// const chaiHTTP = require("chai-http");
// const app = require("../app");
// const { expect } = chai;
// chai.use(chaiHTTP);

// const endpoint = "/subscriber/v1/consent";
// const type = "application/json";
// function chaiApiCall(app, endpoint, data, callback) {
//   return chai
//     .request(app)
//     .post(endpoint)
//     .type(type)
//     .send(data)
//     .then(callback)
//     .catch(e => console.warn(e));
// }

// describe("Testing Create Consent API Response", () => {
//   describe(`Testing Api endpoint Response ${endpoint}`, () => {
//     let data = JSON.stringify({
//       subscriber_id: "e73216f434e325d7f687260c2c272cd6",
//       transaction_id: "0fd8d00997a797c63ef4f5fe8e85a772",
//       app_id: "d23a47af-8a4d-4182-ae86-4f57ac15b15a",
//       developer_id: "010bdc29-b409-4879-838c-310f363379c7",
//       scopes: ["sms", "location"],
//       appname: "Weather App"
//     });
//     it(`Should Return Response Code 201 or 302 or 200 for create consent POST`, done => {
//       chai
//         .request(app)
//         .post(endpoint)
//         .type(type)
//         .send(data)
//         .then(res => {
//           expect(res.statusCode).to.be.oneOf([201, 200]);
//           done();
//         })
//         .catch(e => {
//           expect(e.response.statusCode).to.be.equal(302);
//           done();
//         });
//     });
//   });

//   describe(`Testing endpoint Request ${endpoint} for client bad request`, () => {
//     it("Should Reject  for no transaction_id with status code 400", () => {
//       chai
//       .request(app)
//       .post(endpoint)
//       .type(type)
//       .send(JSON.stringify({
//         app,
//         endpoint,
//         data: {
//           subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
//           app_id: "e2274bcab5aa452c7ae03165",
//           developer_id: "a0040a18e227",
//           scopes: ["sms", "location"],
//           access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
//           appname: "Weather App"
//         })
//         .end(function(err, res) {
//           expect(res).to.have.status(123);
//           done();                               // <= Call done to signal callback end
//         })

//     });
//   });
//     it("Should Reject  for no subscriber_id with status code 400", () => {
//       chaiApiCall(
//         {
//           app,
//           endpoint,
//           data: JSON.stringify({
//             app_id: "e2274bcab5aa452c7ae03165",
//             developer_id: "a0040a18e227",
//             transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
//             scopes: ["sms", "location"],
//             access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
//             appname: "Weather App"
//           })
//         },
//         (err, res) => {
//           chai.expect(res.status).to.equal(400);
//         }
//       );
//     });
//     it("Should Reject  for no appname with status code 400", () => {
//       chaiApiCall(
//         {
//           app,
//           endpoint,
//           data: JSON.stringify({
//             subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
//             app_id: "e2274bcab5aa452c7ae03165",
//             developer_id: "a0040a18e227",
//             transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
//             scopes: ["sms", "location"],
//             access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN"
//           })
//         },
//         (err, res) => {
//           chai.expect(res.status).to.equal(400);
//         }
//       );
//     });
//     it("Should Reject  for no scopes with status code 400", () => {
//       chaiApiCall(
//         {
//           app,
//           endpoint,
//           data: JSON.stringify({
//             subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
//             app_id: "e2274bcab5aa452c7ae03165",
//             developer_id: "a0040a18e227",
//             transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
//             access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
//             appname: "Weather App"
//           })
//         },
//         (err, res) => {
//           chai.expect(res.status).to.equal(400);
//         }
//       );
//     });
//     it("Should Reject  for no app_id with status code 400", () => {
//       chaiApiCall(
//         {
//           app,
//           endpoint,
//           data: JSON.stringify({
//             subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
//             transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
//             developer_id: "a0040a18e227",
//             scopes: ["sms", "location"],
//             access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
//             appname: "Weather App"
//           })
//         },
//         (err, res) => {
//           chai.expect(res.status).to.equal(400);
//         }
//       );
//     });
//     it("Should Reject  for no developer_id with status code 400", () => {
//       chaiApiCall(
//         {
//           app,
//           endpoint,
//           data: JSON.stringify({
//             app_id: "e2274bcab5aa452c7ae03165",
//             transaction_id: "598a07b0eba2e78b86563d5393a3cdb3",
//             developer_id: "a0040a18e227",
//             scopes: ["sms", "location"],
//             access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
//             appname: "Weather App"
//           })
//         },
//         (err, res) => {
//           chai.expect(res.status).to.equal(400);
//         }
//       );
//     });
//   });

//   it(`Testing endpoint Request ${endpoint} for invalid transaction_id`, () => {
//     chaiApiCall(
//       {
//         app,
//         endpoint,
//         data: JSON.stringify({
//           subscriber_id: "a0040a18-e227-4bca-b5aa-452c7ae03165",
//           transaction_id: "598a07=sdsdosoehhiudhieuhfdhijcndk",
//           app_id: "e2274bcab5aa452c7ae03165",
//           developer_id: "a0040a18e227",
//           scopes: ["sms", "location"],
//           access_token: "FnyqFzJKZ5hrSB9JARCSpt90tgPN",
//           appname: "Weather App"
//         })
//       },
//       (err, res) => {
//         expect(res.status).to.equal(403);
//         expect(res.statusstatus).to.eql();
//         expect(res.body).to.have.property(
//           "status",
//           "Transaction id is not valid"
//         );
//       }
//     );
//   });
// });
