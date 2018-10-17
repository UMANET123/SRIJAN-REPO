const app = require('../../index');
const request = require('supertest');
const redis = require('redis');
const client = redis.createClient('redis://emailtokens');

describe('Testing Account Verification Endpoint', () => {
    describe('Testing HTTP methods for the /verify endpoint', () => {
        it('Should return 400 for GET', (done) => {
            request(app)
                .get('/verify/oasdlaldjaljdlajdljaldj')
                .expect(400, done);
        });

        it('Should return 405 for PUT', (done) => {
            request(app)
                .put('/verify')
                .expect(405, done);
        });

        it('Should return 405 for PATCH', (done) => {
            request(app)
                .patch('/verify')
                .expect(405, done);
        });

        it('Should return 405 for DELETE', (done) => {
            request(app)
                .delete('/verify')
                .expect(405, done);
        });

        it('Should return 402 for POST', (done) => {
            request(app)
                .post('/verify')
                .send({
                    email: "test@globe.com",
                    hash: "ajsdlajldjaljdlajd"
                })
                .expect(404, done);
        });
    });

    describe('Testing hash validation for the endpoint', () => {
        it('it should return 400 for malformed hash', (done) => {
            request(app)
                .get('/verify/ajsdlajldjaljdlajd')
                .expect(400, done);
        });

        it('Should return 200 for successful verification', (done) => {
            let verifyBody;
            request(app)
                .post('/register')
                .send({
                    firstname: "firstname",
                    middlename: "middlename",
                    lastname: "lastname",
                    address: "address",
                    msisdn: "639234567891",
                    email: "testuser@test.com",
                    password: "baconpancakes",
                })
                .expect(201)
                .end((err, res) => {
                    verifyBody = res.body
                    request(app)
                        .get(`/verify/${verifyBody.hash}`)
                        .expect(200, done);
                });
        });

        it('Should return 400 when the verification window expires', (done) => {
            let verifyBody;
            request(app)
                .post('/register')
                .send({
                    firstname: "firstname",
                    middlename: "middlename",
                    lastname: "lastname",
                    address: "address",
                    msisdn: "639234567891",
                    email: "testuser@test.com",
                    password: "baconpancakes",
                })
                .expect(201)
                .end((err, res) => {
                    verifyBody = res.body
                    client.del(verifyBody.hash);
                    request(app)
                        .get(`/verify/${verifyBody.hash}`)
                        .expect(400, done);
                });
        });
    });
});