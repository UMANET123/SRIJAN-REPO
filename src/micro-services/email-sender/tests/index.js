const app = require('../index');
const request = require('supertest');

describe('Testing the /sendmail endpoint', () => {
    describe('Testing HTTP methods on the /sendmail endpoint', () => {
        it('Should return 405 for GET', (done) => {
            request(app)
                .get('/sendmail')
                .expect(405, done);
        });

        it('Should return 405 for PUT', (done) => {
            request(app)
                .put('/sendmail')
                .expect(405, done);
        });

        it('Should return 405 for PATCH', (done) => {
            request(app)
                .patch('/sendmail')
                .expect(405, done);
        });

        it('Should return 405 for DELETE', (done) => {
            request(app)
                .delete('/sendmail')
                .expect(405, done);
        });

        it('Should return 202 for POST', (done) => {
            request(app)
                .post('/sendmail')
                .send({
                    to: 'test@test.com',
                    subject: 'Test Email',
                    from: "test@testmail.com",
                    fromName: "Test Email",
                    body: '<h1>Hello, World</h1>"'
                })
                .expect(202, done);
        });
    });

    describe('Testing Validations on the /sendmail endpoint', () => {
        it('Should return 400 if the to email is invalid', (done) => {
            request(app)
                .post('/sendmail')
                .send({
                    to: 'testtest.com',
                    subject: 'Test Email',
                    from: "test@testmail.com",
                    fromName: "Test Email",
                    body: '<h1>Hello, World</h1>"'
                })
                .expect(400, done);
        });

        it('Should return 400 if the from email is invalid', (done) => {
            request(app)
                .post('/sendmail')
                .send({
                    to: 'test@test.com',
                    subject: 'Test Email',
                    from: "testtestmail.com",
                    fromName: "Test Email",
                    body: '<h1>Hello, World</h1>"'
                })
                .expect(400, done);
        });

        it('Should return 400 if the email body is missing', (done) => {
            request(app)
                .post('/sendmail')
                .send({
                    to: 'test@test.com',
                    subject: 'Test Email',
                    from: "test@testmail.com",
                    fromName: "Test Email",
                    body: ''
                })
                .expect(400, done);
        });

        it('Should return 202 if all things check out', (done) => {
            request(app)
                .post('/sendmail')
                .send({
                    to: 'test@test.com',
                    subject: 'Test Email',
                    from: "test@testmail.com",
                    fromName: "Test Email",
                    body: '<h1>Hello, World</h1>"'
                })
                .expect(202, done);
        });
    });
});