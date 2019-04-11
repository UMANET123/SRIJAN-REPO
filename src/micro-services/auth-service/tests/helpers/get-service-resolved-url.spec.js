let getServiceResolvedUrl = require("../../helpers/get-service-resolved-url");
let chai = require("chai");

describe("Testing Get Service Resolved URL function", () => {
  describe("Happy Flow checking Testing Get Service Resolved URL function", () => {
    it("Should return a URL with http string protocol always when required parameters are passed", () => {
      getServiceResolvedUrl(
        "consentservice",
        "/subscriber/v1",
        "http://consentms:3002/subscriber/v1"
      )
        .then(url => {
          console.log("url", { url });
          chai
            .expect(url)
            .to.be.a("string")
            .and.satisfy(
              urlParam =>
                urlParam.startsWith("http://") ||
                urlParam.startsWith("https://")
            );
        })
        .catch(err => {
          console.log({ err });
        });
    });
  });
  describe("Will Fail Get Service Resolved URL function", () => {
    describe("Should return error  if ( serviceHost,serviceEndpointUri,serviceDefaultPath) any of ther parameters having falsy", () => {
      it("Service Host falsy value will return error", () => {
        getServiceResolvedUrl(
          null,
          "http://consentms:3002/subscriber/v1"
        ).catch(err => {
          chai.expect(err).to.be.an("error");
        });
      });
      it("Should return error  if falsy serviceEndpointUri is passed", () => {
        getServiceResolvedUrl("consentms", null).catch(err => {
          chai.expect(err).to.be.an("error");
        });
      });
      it("Should return error  if falsy serviceDefaultPath is passed", () => {
        getServiceResolvedUrl("consentms", null).catch(err => {
          chai.expect(err).to.be.an("error");
        });
      });
      it("Should return error  if falsy protocolStr is passed", () => {
        getServiceResolvedUrl(
          "consentms",
          "/subscriber/v1",
          "http://consentms:3002/subscriber/v1",
          null
        ).catch(err => {
          chai.expect(err).to.be.an("error");
        });
      });
    });
  });
});
