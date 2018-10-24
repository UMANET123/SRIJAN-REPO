const app = require('../../app');
const request = require('supertest');


describe("Testing Login Functionality", () => {
    let email = 'globe@globe.com';
    let password = 'baconpancakes';

    describe('Test to check all the possible login flows', () => {
        it('Should return 200 for a successful login', (done) => {

            request(app)
                .post('/register')
                .send({
                    "firstname": "firstnameexample",
                    "middlename": "middlenameexample",
                    "lastname": "lastnameexample",
                    "address": "address example",
                    "msisdn": "639234567891",
                    "email": email,
                    "password": password
                })
                .expect(201)
                .end((err, response) => {
                    request(app)
                        .get(`/verify/${response.body.hash}`)
                        .expect(201)
                        .end((err, res) => {
                            setTimeout(() => {
                                request(app)
                                    .post('/login')
                                    .send({
                                        email: email,
                                        password: password
                                    })
                                    .expect(200, done);
                            }, 500)

                        })
                })

        });

        it('Should return 401 for incorrect email', (done) => {
            request(app)
                .post('/login')
                .send({
                    email: 'test@test.com',
                    password: 'baconpancakes'
                })
                .expect(401, done);
        });

        it('Should return 401 for incorrect password', (done) => {
            request(app)
                .post('/login')
                .send({
                    email: email,
                    password: 'aconpancakes'
                })
                .expect(401, done());
        });

        it('Should return 401 if email does not exist', (done) => {
            request(app)
                .post('/login')
                .send({
                    email: 'test@test.com',
                    password: 'baconpancakes'
                })
                .expect(401, done);
        });

        it('Should return 401 if the email is not verified', (done) => {
            request(app)
                .post('/login')
                .send({
                    email: 'notverified@globe.com',
                    password: password
                })
                .expect(401, done);
        });
    });

    describe('Test to check email and password validations', () => {
        it('should return 400 if the email is invalid', (done) => {
            request(app)
                .post('/login')
                .send({
                    email: 'test@testcom',
                    password: 'baconpancakes'
                })
                .expect(400, done);
        });

        it('should return 400 if the password length is less than 6', (done) => {
            request(app)
                .post('/login')
                .send({
                    email: 'test@test.com',
                    password: 'cakes'
                })
                .expect(400, done);
        });
    });
});