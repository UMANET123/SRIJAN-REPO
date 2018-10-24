const app = require('../../app');
const request = require('supertest');

describe("Testing the endpoint /resend", () => {

    describe('Test for /resend functionality', () => {

        it('should return status 201 for success', (done) => {
            let email = 'resend@globe.com';
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
                    request(app)
                        .post('/resend')
                        .send({
                            email: email
                        })
                        .expect(201, done);
                })

        });
    });
});