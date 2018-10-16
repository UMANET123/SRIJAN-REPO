const app = require('../../index');
const request = require('supertest');

describe("Testing the endpoint /regenerate", () => {
    describe('Testing HTTP methods on endpoint /regenerate', () => {
        it('Should return 405 for GET', (done) => {
            request(app)
                .get('/regenerate')
                .expect(405, done);
        });

        it('Should return 405 for PUT', (done) => {
            request(app)
                .put('/regenerate')
                .expect(405, done);
        });

        it('Should return 405 for PATCH', (done) => {
            request(app)
                .patch('/regenerate')
                .expect(405, done);
        });

        it('Should return 405 for DELETE', (done) => {
            request(app)
                .delete('/regenerate')
                .expect(405, done);
        });

        it('Should return 201 for POST', (done) => {
            request(app)
                .post('/regenerate')
                .send({
                    email: "testuser@test.com",
                })
                .expect(201, done);
        });
    });

    describe('Test for /regenerate functionality', () => {

        it('should return status 201 for success', (done) => {
            let email = 'globe@globe.com';
            request(app)
                .post('/regenerate')
                .send({
                    email: email
                })
                .expect(201, done);
        });
    });
});