const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect, should } = chai;
chai.use(chaiHTTP);

const endpoint =
  "/subscriber/v1/blacklist/e73216f434e325d7f687260c2c272cd6/d23a47af-8a4d-4182-ae86-4f57ac15b15a";
describe(`Testing Response Code for ${endpoint}`, () => {
  it(`Should Return Response Code  200 or 204 GET Check Blacklist`, done => {
    chai
      .request(app)
      .get(endpoint)
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.be.oneOf([200, 204]);
        if (res.statusCode == 200) {
          expect(res.body).to.be.an("object");
          expect(res.body).to.have.property("is_blacklisted");
          expect(res.body.is_blacklisted).to.be.a("boolean");
        }
        done();
      });
  });
  it(`Should Return Response Code  404 without app_id  GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get("/subscriber/v1/blacklist/e73216f434e325d7f687260c2c272cd6")
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
  it(`Should Return Response Code  404 without subscriber_id  GET Subscriber Apps`, done => {
    chai
      .request(app)
      .get("/subscriber/v1/blacklist/d23a47af-8a4d-4182-ae86-4f57ac15b15a")
      .end((err, res) => {
        expect(err).to.equal(null);
        expect(res.statusCode).to.equal(404);
        done();
      });
  });
});
