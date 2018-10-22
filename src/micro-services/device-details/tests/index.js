const app = require('../index');
const request = require('supertest');

describe('Testing the device details endpoint', () => {
    it('Should return 200 for a valid request', (done) => {
        setTimeout(() => {
            request(app)
                .get('/details/tac/01171300')
                .expect(200, done);
        }, 1000);
    });

    it('Should return 400 for a bad TAC in request url', (done) => {
        request(app)
            .get('/details/tac/0117130')
            .expect(400, done);
    });

    it('Should return 400 for a bad TYPE in request url', (done) => {
        request(app)
            .get('/details/imei/01171300')
            .expect(400, done);
    });
})