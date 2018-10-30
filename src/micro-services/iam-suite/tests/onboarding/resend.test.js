const app = require('../../app');
const request = require('supertest');

describe("Testing the endpoint /resend", () => {

    describe('Test for /resend functionality', () => {
        let email = 'resend@globe.com';
        let responseBody;
        it('should return status 201 for success', (done) => {
            request(app)
                .post('/register')
                .send({
                    "firstname": "firstnameexample",
                    "middlename": "middlenameexample",
                    "lastname": "lastnameexample",
                    "address": "address example",
                    "msisdn": "639234567891",
                    "email": email,
                    "password": "baconpancakes"
                }).end((err, res) => {
                    responseBody = res.body;
                    request(app)
                        .post('/resend')
                        .send({
                            email: email
                        })
                        .expect(201, done);
                })

        });

        it('Should return status 400 for an email that is already verified', (done) => {
            request(app)
                .get(`/verify/${responseBody.hash}`)
                .end((err, res) => {
                    request(app)
                        .post('/resend')
                        .send({
                            email: email
                        })
                        .expect(400, done);
                })
        })
    });
});