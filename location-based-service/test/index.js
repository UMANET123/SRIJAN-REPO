var chai = require('chai');
var app = require('../index');
var chaiHttp = require('chai-http');

chai.use(chaiHttp);

let endpoint = '/'

describe('Location Based Service', () => {

    describe('HTTP Method Test', () => {
        it('GET Should Return 405 ', (done) => {
            chai.request(app)
                .get(endpoint)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                    done();
                })
        })

        it('PUT Should Return 405', (done) => {
            chai.request(app)
                .put(endpoint)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405)
                    done();
                })
        })

        it('Delete Should Return 405', (done) => {
            chai.request(app)
                .delete(endpoint)
                .end((err, res) => {
                    chai.expect(res).to.have.status(405)
                    done();
                })
        })

        it('POST Should Return 200', (done) => {
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

    describe('Validation Tests', () => {
        describe('Soap Contract', () => {
            it('Missing', (done) => {
                chai.request(app)
                    .post(endpoint)
                    .type("application/xml")
                    .end((err, res) => {
                        chai.expect(res).to.have.status(400)
                        done();
                    })
            });

            it('Present', (done) => {
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

        describe('MSISDN', () => {
            it('Not Philippines number', (done) => {
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

            it('philippines Number', (done) => {
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