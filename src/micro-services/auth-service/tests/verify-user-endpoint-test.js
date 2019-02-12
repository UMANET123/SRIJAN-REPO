const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../app');
const {expect} = chai;
chai.use(chaiHTTP);

const endpoints = {
    verify: '/verify/user'
};

describe('Testing Verify User API Response Status', () => {
    describe(`Testing Api endpoint Response ${endpoints.verify}`, () => {
        let data = JSON.stringify({
            "msisdn": "639234567891"
        });
        it('Should Return UUID in Response with 200', () => {
                chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.members(['subscriber_id']);
                });
        });
        data = JSON.stringify({
            subscriber_id : "PBRTKRTWG5GXKTTUKRKDQMCGGBSGWN2Q"
        });
        it('Should Return msisdn in Response with 200', () => {
                chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    expect(res.status).to.equal(200);
                    expect(res.body).to.have.members(['msisdn']);
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