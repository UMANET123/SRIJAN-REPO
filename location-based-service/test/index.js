var chai = require('chai');
var app = require('../index');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

let endpoint = '/locationManagement/monetization'

describe('Testing Location Based Service', () => {

    describe('Testing HTTP Method for Location Based Service', () => {
        it('Should return 405 for GET request', (done) => {
            chai.request(app)
                .get(endpoint)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                    done();
                })
        })

        it('Should return 405 for PUT request', (done) => {
            chai.request(app)
                .put(endpoint)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405)
                    done();
                })
        })

        it('Should return 405 for PATCH request', (done) => {
            chai.request(app)
                .patch(endpoint)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405)
                    done();
                })
        })

        it('Should return 405 for DELETE request', (done) => {
            chai.request(app)
                .delete(endpoint)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405)
                    done();
                })
        })

        it('Should return 200 for POST request', (done) => {
            let request = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:loc="http://www.globe.com/warcraft/wsdl/locationmgt/">
            <soap:Header/>
            <soap:Body>
               <loc:GetLocationByMSISDN>
                  Optional:
                  <CSP_Txid>127917398719237</CSP_Txid>
                  Optional:
                  <CP_Id>10</CP_Id>
                  Optional:
                  <CP_UserId>123</CP_UserId>
                  Optional:
                  <CP_Password>akshdkahdk</CP_Password>
                  Optional:
                  <ServiceId>12312313</ServiceId>
                  Optional:
                  <ProductId>1243143</ProductId>
                  <MSISDN>639234567891</MSISDN>
               </loc:GetLocationByMSISDN>
            </soap:Body>
         </soap:Envelope>`

            chai.request(app)
                .post(endpoint)
                .type("application/xml")
                .send(request)
                .end((err, res) => {
                    chai.expect(res).to.have.status(200)
                    done();
                })
        })
    })

    describe('Validation Tests for Location Based Service', () => {
        describe('Validating presence of SOAP Contract for Location Based Service', () => {
            it('Should return 400 for missing SOAP Contract', (done) => {
                chai.request(app)
                    .post(endpoint)
                    .type("application/xml")
                    .end((err, res) => {
                        chai.expect(res).to.have.status(400)
                        done();
                    })
            });

            it('Should return 200 for present SOAP Contract', (done) => {
                let request = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:loc="http://www.globe.com/warcraft/wsdl/locationmgt/">
            <soap:Header/>
            <soap:Body>
               <loc:GetLocationByMSISDN>
                  Optional:
                  <CSP_Txid>127917398719237</CSP_Txid>
                  Optional:
                  <CP_Id>10</CP_Id>
                  Optional:
                  <CP_UserId>123</CP_UserId>
                  Optional:
                  <CP_Password>akshdkahdk</CP_Password>
                  Optional:
                  <ServiceId>12312313</ServiceId>
                  Optional:
                  <ProductId>1243143</ProductId>
                  <MSISDN>639234567891</MSISDN>
               </loc:GetLocationByMSISDN>
            </soap:Body>
         </soap:Envelope>`

                chai.request(app)
                    .post(endpoint)
                    .type("application/xml")
                    .send(request)
                    .end((err, res) => {
                        chai.expect(res).to.have.status(200)
                        done();
                    })
            })
        })

        describe('Validating MSISDN (Mobile Number) for Location Based Service', () => {
            it('Should return 400 if MSISDN does not belong to the Philippines', (done) => {
                let request = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:loc="http://www.globe.com/warcraft/wsdl/locationmgt/">
            <soap:Header/>
            <soap:Body>
               <loc:GetLocationByMSISDN>
                  Optional:
                  <CSP_Txid>127917398719237</CSP_Txid>
                  Optional:
                  <CP_Id>10</CP_Id>
                  Optional:
                  <CP_UserId>123</CP_UserId>
                  Optional:
                  <CP_Password>akshdkahdk</CP_Password>
                  Optional:
                  <ServiceId>12312313</ServiceId>
                  Optional:
                  <ProductId>1243143</ProductId>
                  <MSISDN>091234567891</MSISDN>
               </loc:GetLocationByMSISDN>
            </soap:Body>
         </soap:Envelope>`
                chai.request(app)
                    .post(endpoint)
                    .type("application/xml")
                    .send(request)
                    .end((err, res) => {
                        chai.expect(res).to.have.status(400);
                        done();
                    })
            })

            it('Should return 200 if MSISDN (Mobile Number) belongs to the Philippines', (done) => {
                let request = `<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:loc="http://www.globe.com/warcraft/wsdl/locationmgt/">
                <soap:Header/>
                <soap:Body>
                   <loc:GetLocationByMSISDN>
                      Optional:
                      <CSP_Txid>127917398719237</CSP_Txid>
                      Optional:
                      <CP_Id>10</CP_Id>
                      Optional:
                      <CP_UserId>123</CP_UserId>
                      Optional:
                      <CP_Password>akshdkahdk</CP_Password>
                      Optional:
                      <ServiceId>12312313</ServiceId>
                      Optional:
                      <ProductId>1243143</ProductId>
                      <MSISDN>639234567891</MSISDN>
                   </loc:GetLocationByMSISDN>
                </soap:Body>
             </soap:Envelope>`
                chai.request(app)
                    .post(endpoint)
                    .type("application/xml")
                    .send(request)
                    .end((err, res) => {
                        chai.expect(res).to.have.status(200)
                        done();
                    })
            })
        })
    })
})