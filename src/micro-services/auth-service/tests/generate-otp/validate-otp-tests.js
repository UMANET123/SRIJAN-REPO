// const chai = require('chai');
// const chaiHTTP = require('chai-http');
// const app = require('../../../index');

// chai.use(chaiHTTP);

// const endpoints = {
//     generate: '/generate',
//     verify: '/verify'
// };

// describe("Test Validity of OTP for Two Factor Authentication", () => {
//     describe(`Testing Validity of OTP for endpoint ${endpoints.verify}`, () => {
//         it('Should Accept a Number as OTP with status 200', () => {
//             let data = JSON.stringify({
//                 otp: "829025",
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(200);
//                 });
//         });
//         it('Should Reject an OTP which is not a number with status 400', () => {
//             let data = JSON.stringify({
//                 otp: "829BA5",
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(400);
//                 });
//         });

//         it('Should Reject an OTP which is not a number with an error message', () => {
//             let data = JSON.stringify({
//                 otp: "829BA5",
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res.body.error).to.equal('OTP should be numbers only');
//                 });
//         });

//         it('Should Accept OTP of length 6 with status 200', () => {
//             let data = JSON.stringify({
//                 otp: "829005",
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(200);
//                 });
//         });

//         it('Should Reject OTP of length > 6 with status 400', () => {
//             let data = JSON.stringify({
//                 otp: "8290005",
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(400);
//                 });
//         });

//         it('Should Reject OTP of length > 6 with an error message', () => {
//             let data = JSON.stringify({
//                 otp: "8290005",
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res.body.error).to.equal("OTP length Mismatch");
//                 });
//         });

//         it('Should Reject OTP of length < 6 with status 400', () => {
//             let data = JSON.stringify({
//                 otp: "82905",
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(400);
//                 });
//         });

//         it('Should Reject OTP of length < 6 with an error message', () => {
//             let data = JSON.stringify({
//                 otp: "82905",
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res.body.error).to.equal("OTP length Mismatch");
//                 });
//         });

//         it('Should Accept OTP that is present with status 200', () => {
//             let data = JSON.stringify({
//                 otp: "829005",
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(200);
//                 });
//         });

//         it('Should Reject if OTP not present with status 400', () => {
//             let data = JSON.stringify({
//                 address: "639234567891"
//             });

//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(400);
//                 });
//         });

//         it('Should Reject if OTP not present with an error message', () => {
//             let data = JSON.stringify({
//                 address: "639234567891"
//             });
            
//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(data)
//                 .end((err, res) => {
//                     chai.expect(res.body.error).to.equal("OTP is not present");
//                 });
//         });
//     });
// });