const app = require('../../app');
const request = require('supertest');

describe("Testing the Two Factor Auth Toggle", () => {

    describe('Test for toggle on 2fa functionality', () => {
        let email = 'toggle2fa@globe.com';
        let responseBody;
        it('should return status 200 for successfully toggling 2fa on', (done) => {
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
                        .get(`/verify/${responseBody.hash}`)
                        .expect(200)
                        .end((err, res) => {
                            request(app)
                                .post("/toggle_2fa")
                                .send({
                                    email: email,
                                    twoFactorAuth: "true",
                                    transponder: "email"
                                })
                                .expect(200)
                                .end((err, res) => {
                                    request(app)
                                        .post('/login')
                                        .send({
                                            email: email,
                                            password: 'baconpancakes'
                                        })
                                        .expect(200, {
                                            email: email,
                                            message: "Successfully Logged in"
                                        }, done)
                                })
                        });
                })

        });

        it('should return status 200 for successfully toggling 2fa off', (done) => {
            request(app)
                .post("/toggle_2fa")
                .send({
                    email: email,
                    twoFactorAuth: "false",
                })
                .expect(200)
                .end((err, res) => {
                    request(app)
                        .post('/login')
                        .send({
                            email: email,
                            password: 'baconpancakes'
                        })
                        .expect(200, {
                            message: "Successfully Logged in"
                        }, done)
                })
        })
    });
});