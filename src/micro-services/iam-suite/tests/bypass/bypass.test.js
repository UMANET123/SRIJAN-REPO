const app = require('../../app');
const request = require('supertest');


describe('Test to check the api bypass endpoint', () => {
    it('Should return 400 for only numerical app id', (done) => {
        request(app)
            .get('/status/12345676')
            .expect(400, done);
    });

    it('Should return 404 if app id is not registered', (done) => {
        request(app)
            .get('/status/12345676aa')
            .expect(404, done);
    });

    it('Should return 200 if app id is registered', (done) => {
        request(app)
            .get('/status/1234598329kadhfa')
            .expect(200, done);
    });
});