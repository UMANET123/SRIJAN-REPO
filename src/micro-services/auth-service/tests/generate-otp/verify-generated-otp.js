// const chai = require('chai');
// const chaiHttp = require('chai-http');
// const app = require('../../../index');
// const sinon = require ('sinon');

// chai.use(chaiHttp);

// const endpoints = {
//     generate: '/generate',
//     verify: '/verify'
// };

// describe("Test to Verify Generated OTP and OTP Alive Time for Two Factor Authentication", () => {
//     describe('Test Validating a generated OTP', () => {
//         let address = '639234567891';
//         let otpFromGenerate = "";

//         it('Should Generate a Valid OTP and return status 201', () => {
//             chai.request(app)
//                 .post(endpoints.generate)
//                 .type('application/json')
//                 .send(JSON.stringify({
//                     address: address
//                 }))
//                 .end((err, res) => {
//                     otpFromGenerate = res.body.otp;
//                     chai.expect(res).to.have.status(201);
//                 });
//         });

//         it('Should Verify Generated OTP and return status 200', () => {
//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(JSON.stringify({
//                     address: address,
//                     otp: otpFromGenerate
//                 }))
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(200);
//                 });
//         });

//         it('Should Verify Generated OTP and return a success message', () => {
//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(JSON.stringify({
//                     address: address,
//                     otp: otpFromGenerate
//                 }))
//                 .end((err, res) => {
//                     chai.expect(res.body.status).to.equal('success');
//                 });
//         });
//     });

//     describe('Test Invalidating a generated OTP', () => {
//         let address = '639234567891';
//         let otpFromGenerate = "";
//         let clock = sinon.useFakeTimers(Date.now());

//         it('Should Generate a Valid OTP and return status 201', () => {
//             chai.request(app)
//                 .post(endpoints.generate)
//                 .type('application/json')
//                 .send(JSON.stringify({
//                     address: address
//                 }))
//                 .end((err, res) => {
//                     otpFromGenerate = res.body.otp;
//                     chai.expect(res).to.have.status(201);
//                 });
//         });

//         it('Should invalidate generated OTP and return status 200 with failure message', () => {
//             clock.tick(40000);
//             chai.request(app)
//                 .post(endpoints.verify)
//                 .type('application/json')
//                 .send(JSON.stringify({
//                     address: address,
//                     otp: otpFromGenerate
//                 }))
//                 .end((err, res) => {
//                     chai.expect(res).to.have.status(200);
//                     chai.expect(res.body.status).to.equal('failed');
//                 });
//         });
//     });
// });