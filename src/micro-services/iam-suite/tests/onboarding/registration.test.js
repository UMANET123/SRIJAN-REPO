const app = require('../../app');
const request = require('supertest');

describe('Testing Registration Functionality', () => {

    describe('Tests for validations while registration', () => {
        it('Should return 400 for invalid emaill address', (done) => {
            request(app)
                .post('/register')
                .send({
                    firstname: "firstname",
                    middlename: "middlename",
                    lastname: "lastname",
                    address: "address",
                    msisdn: "639234567891",
                    email: "testregister1@testcom",
                    password: "baconpancakes",
                })
                .expect(400, done);
        });

        it('Should return 400 if password length less than 6', (done) => {
            request(app)
                .post('/register')
                .send({
                    firstname: "firstname",
                    middlename: "middlename",
                    lastname: "lastname",
                    address: "address",
                    msisdn: "639234567891",
                    email: "testregister1@test.com",
                    password: "cakes",
                })
                .expect(400, done);
        });

        it('Should return 400 if the mobile number is not from the Philippines ', (done) => {
            request(app)
                .post('/register')
                .send({
                    firstname: "firstname",
                    middlename: "middlename",
                    lastname: "lastname",
                    address: "address",
                    msisdn: "633234567891",
                    email: "testregister1@test.com",
                    password: "baconpancakes",
                })
                .expect(400, done);
        });

        it('Should return 201 if all fields are valid and user is registered successfully', (done) => {
            request(app)
                .post('/register')
                .send({
                    firstname: "firstname",
                    middlename: "middlename",
                    lastname: "lastname",
                    address: "address",
                    msisdn: "639234567891",
                    email: "testregister1@test.com",
                    password: "baconpancakes",
                })
                .expect(201, done);
        });
    });
});