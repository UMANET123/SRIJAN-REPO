const chai = require('chai');
const chaiHttp = require('chai-http')
const app = require('../index');

chai.use(chaiHttp);

let generateEndpoint = '/generate';
let verifyEndpoint = '/verify';

describe("Testing Two Factor Authentication",()=>{

})