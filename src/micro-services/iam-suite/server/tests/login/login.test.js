const chai = require('chai');
const chaiHttp = require('chai-http');
const app = require('../../index');
const sinon = require('sinon');

chai.use(chaiHttp);

describe("Test to Check Login Endpoint of IAM-Suite", () => {
    describe('Test to check that login only allows POST method', () => {
        let email = 'test@test.com';
        let password = 'baconpancakes';
        let verifyBody;
        it('should register a user and verify his email to continue with the test', (done) => {
            chai.request(app)
                .post('/register')
                .type('application/json')
                .send(JSON.stringify({
                    firstname: "firstnameexample",
                    middlename: "middlenameexample",
                    lastname: "lastnameexample",
                    address: "address example",
                    msisdn: "639234567891",
                    email: email,
                    password: password
                }))
                .end((err, res) => {
                    chai.expect(res.body.email).to.be.equal(email);
                    verifyBody = res.body
                    done();
                })

        })

        it('should verify the email address to continue with the test', (done) => {
            chai.request(app)
                .post('/verify')
                .type('application/json')
                .send(verifyBody)
                .end((err, res) => {
                    chai.expect(res.body.message).to.be.equal("Email Verification Completed");
                    done();
                })
        })
        it('should return 200 for POST', (done) => {
            chai.request(app)
                .post('/login')
                .type('application/json')
                .send(JSON.stringify({
                    email: email,
                    password: password
                }))
                .end((err, res) => {
                    chai.expect(res).to.have.status(200);
                    chai.expect(res.body.message).to.be.equal("Successfully Logged in");
                    done();
                });
        });

        it('should return 405 for PUT', (done) => {
            chai.request(app)
                .put('/login')
                .type('application/json')
                .send(JSON.stringify({
                    email: email,
                    password: password
                }))
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                    chai.expect(res.body.error).to.be.equal('Method not allowed');
                    done();
                });
        });

        it('should return 405 for PATCH', (done) => {
            chai.request(app)
                .patch('/login')
                .type('application/json')
                .send(JSON.stringify({
                    email: email,
                    password: password
                }))
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                    chai.expect(res.body.error).to.be.equal('Method not allowed');
                    done();
                });
        });

        it('should return 405 for DELETE', (done) => {
            chai.request(app)
                .delete('/login')
                .type('application/json')
                .send(JSON.stringify({
                    email: email,
                    password: password
                }))
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                    chai.expect(res.body.error).to.be.equal('Method not allowed');
                    done();
                });
        });

        it('should return 405 for GET', (done) => {
            chai.request(app)
                .get('/login')
                .type('application/json')
                .end((err, res) => {
                    chai.expect(res).to.have.status(405);
                    chai.expect(res.body.error).to.be.equal('Method not allowed');
                    done();
                });
        });
    });

    // describe('Test to check the login flow', () => {
    //     let email = 'test1234@test.com';
    //     let password = 'baconpancakes';
    //     let verifyBody;
    //     it('should register a user and not deny login since verification was not complete', (done) => {
    //         var requester = chai.request(app).keepOpen()
    //         requester.post('/register')
    //             .type('application/json')
    //             .send(JSON.stringify({
    //                 firstname: "firstnameexample",
    //                 middlename: "middlenameexample",
    //                 lastname: "lastnameexample",
    //                 address: "address example",
    //                 msisdn: "639234567891",
    //                 email: email,
    //                 password: password
    //             }))
    //             .then((value) => {
    //                 requester.post('/login')
    //                     .type('application/json')
    //                     .send(value.body)
    //                     .end((err, res) => {

    //                         chai.expect(res).to.have.status(401);
    //                         chai.expect(res.body.message).to.have.equal("Please Verify your email")
    //                         done();
    //                     });
    //             })



    //     })

    //     // it('should not allow a user to login since the verification process is not complete', (done) => {

    //     // })

    //     // it('should verify the email address to continue with the test', (done) => {
    //     //     chai.request(app)
    //     //         .post('/verify')
    //     //         .type('application/json')
    //     //         .send(verifyBody)
    //     //         .end((err, res) => {
    //     //             chai.expect(res.body.message).to.be.equal("Email Verification Completed");
    //     //             done();
    //     //         })
    //     // })

    //     // it('should return 200 for a successful login', () => {
    //     //     chai.request(app)
    //     //         .post('/login')
    //     //         .type('application/json')
    //     //         .send(JSON.stringify({
    //     //             email: email,
    //     //             password: password
    //     //         }))
    //     //         .end((err, res) => {
    //     //             console.log(res.body);
    //     //             chai.expect(res).to.have.status(200);
    //     //         });
    //     // });

    //     // it('should return 400 for a user that does not exist', (done) => {
    //     //     chai.request(app)
    //     //         .post('/login')
    //     //         .type('application/json')
    //     //         .send(JSON.stringify({
    //     //             email: 'globe@globae.com',
    //     //             password: 'baconpancakes'
    //     //         }))
    //     //         .end((err, res) => {
    //     //             console.log("I reach here");
    //     //             chai.expect(res).to.have.status(401);
    //     //             done();
    //     //         });
    //     // });

    //     // it('should return 401 for a wrong login password', (done) => {
    //     //     chai.request(app)
    //     //         .post('/login')
    //     //         .type('application/json')
    //     //         .send(JSON.stringify({
    //     //             email: 'globe@globe.com',
    //     //             password: 'baconpancakes'
    //     //         }))
    //     //         .end((err, res) => {
    //     //             chai.expect(res).to.have.status(400);
    //     //             done();
    //     //         });
    //     // });


    // });
});