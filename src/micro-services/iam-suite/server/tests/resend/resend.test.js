const app = require('../../index');
const request = require('supertest');

describe("Testing the endpoint /resend", () => {
    describe('Testing HTTP methods on endpoint /resend', () => {
        it('Should return 404 for GET', (done) => {
            request(app)
                .get('/resend')
                .expect(404, done);
        });

        it('Should return 405 for PUT', (done) => {
            request(app)
                .put('/resend')
                .expect(405, done);
        });

        it('Should return 405 for PATCH', (done) => {
            request(app)
                .patch('/resend')
                .expect(405, done);
        });

        it('Should return 405 for DELETE', (done) => {
            request(app)
                .delete('/resend')
                .expect(405, done);
        });

        it('Should return 201 for POST', (done) => {
            request(app)
                .post('/resend')
                .send({
                    email: "testuser@test.com",
                })
                .expect(201, done);
        });
    });

    describe('Test for /resend functionality', () => {

        it('should return status 201 for success', (done) => {
            let email = 'globe@globe.com';
            request(app)
                .post('/resend')
                .send({
                    email: email
                })
                .expect(201, done);
        });
    });
});