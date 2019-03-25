const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect, should } = chai;
chai.use(chaiHTTP);

const endpoint = "/subscriber/v1/app/search/e73216f434e325d7f687260c2c272cd6";
describe(`Testing Response Code for ${endpoint}`, () => {
  it(`Should Return Response Code  200  GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get(endpoint)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(res.body).to.have.property("appname");
        expect(res.body.appname).to.be.an("array");
        done();
      });
  });
  it(`Should Return no apps for invalid subscriber id GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get("/subscriber/v1/app/search/absdasds3jzzzzzz")
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(200);
        expect(res.body.appname).to.be.an("array");
        expect(res.body.appname.length).to.equal(0);
        done();
      });
  });
  it(`Should Return Response Code  404 without subscriber_id  GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get("/subscriber/v1/app/search")
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});
