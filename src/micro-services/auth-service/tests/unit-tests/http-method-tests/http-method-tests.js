const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../../../index');


const endpoints = {
    generate: '/generate',
    verify: '/verify'
};

chai.use(chaiHTTP);

describe("Testing HTTP Methods for Two Factor Authentication", () => {
    describe(`Testing HTTP Methods for endpoint ${endpoints.generate}`, () => {

        let data = JSON.stringify({
            address: '639234567891'
        });

        it('Should return 201 on POST', () => {
            chai.request(app)
                .post(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(201);
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

    describe(`Testing HTTP Methods for endpoint ${endpoints.verify}`, () => {
        let data = {
            "otp": "829025",
            "address": "639234567891"
        };

        it('Should return 200 for POST', () => {
            chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                });
        });

        it('Should return 405 for GET', () => {
            chai.request(app)
                .get(endpoints.verify)
                .type('application/json')
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });

        it('Should return 405 for PUT', () => {
            chai.request(app)
                .put(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });

        it('Should return 405 for PATCH', () => {
            chai.request(app)
                .patch(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });

        it('Should return 405 for DELETE', () => {
            chai.request(app)
                .del(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                });
        });
    });
});