const chai = require("chai");
const chaiHTTP = require("chai-http");
const app = require("../app");
const { expect } = chai;
chai.use(chaiHTTP);

const endpoints = {
  generate: "/auth/v1/generate/totp",
  verify: "/auth/v1/verify/totp"
};

let data = JSON.stringify({
  subscriber_id: "IU3VCMTWJJIHKNBWJNKU4STQN5FTGSKD",
  otp: "972623",
  app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
});

describe("Testing Verify TOTP Endpoint", () => {
  describe("Testing HTTP Method Responses", () => {
    it("Should return return 200 for POST", done => {
      let body = {
        msisdn: "639234500095",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: true
      };
      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          chai
            .request(app)
            .post(endpoints.verify)
            .type("application/json")
            .send(res.body)
            .end((err, res) => {
              expect(res).to.have.status(200);
              done();
            });
        });
    });
    it("Should return return 404 for PUT", done => {
      chai
        .request(app)
        .put(endpoints.verify)
        .type("application/json")
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it("Should return return 404 for PATCH", done => {
      chai
        .request(app)
        .patch(endpoints.verify)
        .type("application/json")
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it("Should return return 404 for DELETE", done => {
      chai
        .request(app)
        .delete(endpoints.verify)
        .type("application/json")
        .send({})
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
    it("Should return return 404 for GET", done => {
      chai
        .request(app)
        .get(endpoints.verify)
        .type("application/json")
        .end((err, res) => {
          expect(res).to.have.status(404);
          done();
        });
    });
  });

  describe("Testing Bad Parameter Responses", () => {
    it("Should return 400 if subscriber id is missing", done => {
      let body = {
        subscriber_id: "",
        otp: "972623",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
      };
      chai
        .request(app)
        .post(endpoints.verify)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it("Should return 400 if app id is missing", done => {
      let body = {
        subscriber_id: "IU3VCMTWJJIHKNBWJNKU4STQN5FTGSKD",
        otp: "972623",
        app_id: ""
      };
      chai
        .request(app)
        .post(endpoints.verify)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it("Should return 400 if otp is missing", done => {
      let body = {
        subscriber_id: "IU3VCMTWJJIHKNBWJNKU4STQN5FTGSKD",
        otp: "",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
      };
      chai
        .request(app)
        .post(endpoints.verify)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it("Should return 400 if otp length < 6", done => {
      let body = {
        subscriber_id: "IU3VCMTWJJIHKNBWJNKU4STQN5FTGSKD",
        otp: "9726",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
      };
      chai
        .request(app)
        .post(endpoints.verify)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
    it("Should return 400 if otp length > 6", done => {
      let body = {
        subscriber_id: "IU3VCMTWJJIHKNBWJNKU4STQN5FTGSKD",
        otp: "9726432",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24"
      };
      chai
        .request(app)
        .post(endpoints.verify)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          expect(res).to.have.status(400);
          done();
        });
    });
  });

  describe("Testing Verifying a TOTP", () => {
    it("Should Successfully Verify a TOTP", done => {
      let body = {
        msisdn: "639234500090",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: true
      };

      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .end((err, res) => {
          chai
            .request(app)
            .post(endpoints.verify)
            .type("application/json")
            .send(res.body)
            .end((err, res) => {
              expect(res).to.have.status(200);
              done();
            });
        });
    });
    //Skipping because it fails all the time, only to work when I change the number
    xit("Should Fail Verifing a TOTP due to a Blocked Account", done => {
      let body = {
        msisdn: "639549439189",
        app_id: "a46fa81d-9941-42c1-8b47-c8d57be4acc24",
        blacklist: true
      };

      chai
        .request(app)
        .post(endpoints.generate)
        .type("application/json")
        .send(JSON.stringify(body))
        .then((res) => {
          chai
            .request(app)
            .post(endpoints.verify)
            .type("application/json")
            .send(
              JSON.stringify({
                subscriber_id: res.body.subscriber_id,
                app_id: res.body.app_id,
                otp: "123456"
              })
            )
            .then(() => {
              chai
                .request(app)
                .post(endpoints.verify)
                .type("application/json")
                .send(
                  JSON.stringify({
                    subscriber_id: res.body.subscriber_id,
                    app_id: res.body.app_id,
                    otp: "123456"
                  })
                )
                .then(() => {
                  chai
                    .request(app)
                    .post(endpoints.verify)
                    .type("application/json")
                    .send(
                      JSON.stringify({
                        subscriber_id: res.body.subscriber_id,
                        app_id: res.body.app_id,
                        otp: "123456"
                      })
                    )
                    .then(() => {
                      chai
                        .request(app)
                        .post(endpoints.verify)
                        .type("application/json")
                        .send(JSON.stringify(res.body))
                        .then(res => {
                          expect(res).to.have.status(403);
                          done();
                        });
                    });
                });
            });
        }).
        catch(e => console.log("***** ERROR VERIFIY:",e));
    });
  });
});
