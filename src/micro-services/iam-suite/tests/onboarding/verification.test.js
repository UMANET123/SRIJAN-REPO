const app = require('../../app');
const request = require('supertest');
const redis = require('redis');
const client = redis.createClient('redis://identityredis');

describe('Testing Account Verification Endpoint', () => {

    describe('Testing hash validation for the endpoint', () => {

        it('it should return 400 for malformed hash', (done) => {
            let email = "malformed@gmail.com";
            request(app)
                .post('/register')
                .send({
                    firstname: "firstname",
                    middlename: "middlename",
                    lastname: "lastname",
                    address: "address",
                    msisdn: "639234567891",
                    email: email,
                    password: "baconpancakes",
                })
                .expect(201)
                .end((err, res) => {
                    request(app)
                        .get('/verify/ajsdlajldjaljdlajd')
                        .expect(400, done);
                })

        });

        it('Should return 200 for successful verification', (done) => {
            setTimeout(() => {
                request(app)
                    .post('/register')
                    .send({
                        firstname: "firstname",
                        middlename: "middlename",
                        lastname: "lastname",
                        address: "address",
                        msisdn: "639234567891",
                        email: "testverify1@test.com",
                        password: "baconpancakes",
                    })
                    .expect(201)
                    .end((err, res) => {
                        let hash = res.body.hash
                        request(app)
                            .get(`/verify/${hash}`)
                            .expect(200, done);
                    });
            }, 500)
        });

        it('Should return 400 when the verification window expires', (done) => {
            setTimeout(() => {
                request(app)
                    .post('/register')
                    .send({
                        firstname: "firstname",
                        middlename: "middlename",
                        lastname: "lastname",
                        address: "address",
                        msisdn: "639234567891",
                        email: "testverify2@test.com",
                        password: "baconpancakes",
                    })
                    .expect(201)
                    .end((err, res) => {
                        let hash = res.body.hash;
                        client.del(hash);
                        request(app)
                            .get(`/verify/${hash}`)
                            .expect(400, done);
                    });
            }, 500)

        });
    });
});