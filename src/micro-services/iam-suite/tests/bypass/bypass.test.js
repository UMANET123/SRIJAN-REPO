const app = require('../../app');
const request = require('supertest');


describe('Test to check the api bypass endpoint', () => {

    it('Should return 404 if app id is not registered', (done) => {
        request(app)
            .post('/status')
            .send({
                client_id: "12345676aa",
                scope: "ABC"
            })
            .expect(404, done);
    });

    it('Should return 200 if app id is registered', (done) => {
        setTimeout(() => {
            request(app)
                .post('/status')
                .send({
                    client_id: "M63LZP7Ge68hCMfeE9czOSQQT9qdttKt",
                    scope: "SUBSCRIBER"
                })
                .expect(200, done);
        }, 500)

    });
});