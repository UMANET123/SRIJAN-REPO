const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../app');
const {expect} = chai;
chai.use(chaiHTTP);

const endpoints = {
    generate: '/generate/totp'
};
let data = JSON.stringify({
    "msisdn" : "639234567896",
    "app_id" :"a46fa81d-9941-42c1-8b47-c8d57be4acc24",
    "blacklist": false
});

describe('Testing Generate OTP API Response Status', () => {
    describe(`Testing Api endpoint Response ${endpoints.generate}`, () => {
        it('Should Return Response Code 201/200 for generate otp POST', () => {
                chai.request(app)
                .post(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    console.log({res: res.status});
                    expect(res.status).to.be.oneOf([201, 200]);
                });
        });
        it('Response body should have theses properties to generate otp POST', () => {
            chai.request(app)
                .post(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {

                    expect(res.body).to.have.members(['otp', 'subscriber_id']);
                });
        });
        it('Should return 405 on GET', () => {
            chai.request(app)
                .get(endpoints.generate)
                .type('application/json')
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });
        it('Should return 405 on PUT', () => {
            chai.request(app)
                .put(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });

        it('Should return 405 on PATCH', () => {
            chai.request(app)
                .patch(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });

        it('Should return 405 on DELETE', () => {
            chai.request(app)
                .del(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });
    });
    describe(`Testing endpoint Request ${endpoints.generate}`, () => {
     
        it('Should Reject for Invalid Request Payload with status code 400', () => {
            let data = JSON.stringify({
                abcd: 4567891
            });
            chai.request(app)
                .post(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res.status).to.equal(400);
                });
        });

        it('Should Reject for Invalid Request Type with status code 400', () => {
            let data = JSON.stringify({
                abcd: 4567891
            });
            chai.request(app)
                .post(endpoints.generate)
                .type('application/javscript')
                .send(data)
                .end((err, res) => {
                    chai.expect(res.status).to.equal(400);
                });
        });

        
    });
});