const chai = require('chai');
const chaiHTTP = require('chai-http');
const app = require('../../../index');

chai.use(chaiHTTP);

const endpoints = {
    generate: '/generate',
    verify: '/verify'
};

describe('Testing Address ( Mobile Number ) Validity for Two Factor Authentication', () => {
    describe(`Testing endpoint ${endpoints.generate}`, () => {
        it('Should Accept a Valid Philippines Number', () => {
            let data = JSON.stringify({
                address: 639234567891
            });

            chai.request(app)
                .post(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(201);
                });
        });

        it('Should Reject an Invalid Philippines Number with status code 400', () => {
            let data = JSON.stringify({
                address: 539234567891
            });
            chai.request(app)
                .post(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                });
        });

        it('Should Reject an Invalid Philippines Number with an error message', () => {
            let data = JSON.stringify({
                address: 539234567891
            });

            chai.request(app)
                .post(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res.body).to.have.property('error');;
                    chai.expect(res.body.error).to.equal("Address Invalid");
                });
        });

        it('Should Reject if no number provided, with status code 400', () => {
            let data = JSON.stringify({});

            chai.request(app)
                .post(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                });
        });

        it('Should Reject if no number provided, with an error message', () => {
            let data = JSON.stringify({});

            chai.request(app)
                .post(endpoints.generate)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res.body.error).to.equal('Address Missing');
                });
        });
    });

    describe(`Testing endpoint ${endpoints.verify}`, () => {
        it('Should Accept a Valid Philippines Number', () => {
            let data = JSON.stringify({
                address: "639234567891",
                otp: "123456"
            });
            chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                });
        });

        it('Should Reject an Invalid Philippines Number with status code 400', () => {
            let data = JSON.stringify({
                address: 539234567891,
                otp: "123456"
            });

            chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                });
        });

        it('Should Reject an Invalid Philippines Number with an error message', () => {
            let data = JSON.stringify({
                address: 539234567891,
                otp: "123456"
            });

            chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res.body).to.have.property('error');
                    chai.expect(res.body.error).to.equal("Address Invalid");
                });
        });

        it('Should Reject if no number provided, with status code 400', () => {
            let data = JSON.stringify({});

            chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res).to.have.status(400);
                });
        });

        it('Should Reject if no number provided, with an error message', () => {
            let data = JSON.stringify({});

            chai.request(app)
                .post(endpoints.verify)
                .type('application/json')
                .send(data)
                .end((err, res) => {
                    chai.expect(res.body.error).to.equal('Address Missing');
                });
        });
    });
});