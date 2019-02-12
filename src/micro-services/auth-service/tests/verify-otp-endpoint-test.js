const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../app');
const {expect} = chai;
chai.use(chaiHTTP);

const endpoints = {
    verify: '/verify/totp'
};
let data = JSON.stringify({
    subscriber_id : "IU3VCMTWJJIHKNBWJNKU4STQN5FTGSKD",
    otp : 972623,
    app_id : "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
});

describe('Testing Verify OTP API Response Status', () => {
    describe(`Testing Api endpoint Response ${endpoints.verify}`, () => {
        it('Should Return Response Code 200/401 for verify otp POST', () => {
                chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    console.log({res: res.status});
                    expect(res.status).to.be.oneOf([200, 400]);
                    expect(res.body).to.equal(null);
                });
        });
        it('Should return 405 on GET', () => {
            chai.request(app)
                .get(endpoints.verify)
                .type('application/json')
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });
        it('Should return 405 on PUT', () => {
            chai.request(app)
                .put(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });

        it('Should return 405 on PATCH', () => {
            chai.request(app)
                .patch(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });

        it('Should return 405 on DELETE', () => {
            chai.request(app)
                .del(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });
        it('Should return 400 for maformed Request Payload', () => {
            chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send({"dummy": "dummy json"})
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                });
        });
    });
});