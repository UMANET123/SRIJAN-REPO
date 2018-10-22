const express = require("express");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const redis = require('redis');

const client = redis.createClient('redis://emailtokens');
const app = express();

const NODE_ENV = process.env.NODE_ENV;

client.on('connect', (err) => {
  console.log("connected to Redis server");
});

app.use(bodyParser.json());
morgan.token("request-body", function (req, res) {
  return JSON.stringify(req.body);
});

if (NODE_ENV != 'test') {
  app.use(
    morgan(
      ":method :url :status :res[content-length] - :response-time ms - REQUEST :request-body"
    )
  );
}


const saltRounds = 10;
let mockData = [];
let secret;

crypto.randomBytes(48, function (err, buffer) {
  secret = buffer.toString('hex');
});

bcrypt.hash("baconpancakes", saltRounds, (err, hash) => {
  mockData.push({
    firstname: "Globe",
    middlename: "Test",
    lastname: "User",
    address: "Norzagaray, Bulacan, Philippines",
    msisdn: "639234567891",
    email: "globe@globe.com",
    password: hash,
    emailVerify: true
  }, {
    firstname: "not",
    middlename: "verified",
    lastname: "account",
    address: "Norzagaray, Bulacan, Philippines",
    msisdn: "639234567891",
    email: "notverified@globe.com",
    password: hash,
    emailVerify: false
  });
});

app.use((req, res, next) => {
  if (req.method != "POST" && req.method != "GET") {
    return res.status(405).send({
      error: "Method not allowed"
    });
  }
  next();
});

app.post("/register", (req, res) => {
  if (!checkEmailAddress(req.body.email)) {
    return res.status(400).send({
      message: "Invalid Email Address"
    });
  }

  if (!/^639[0-9]{9}$/.test(req.body.msisdn)) {
    return res.status(400).send({
      message: "Invalid Mobile Number"
    });
  }

  if (req.body.password.length < 6) {
    return res.status(400).send({
      message: "Invalid Password"
    });
  }

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    mockData.push({
      firstname: req.body.firstname,
      middlename: req.body.middlename,
      lastname: req.body.lastname,
      address: req.body.address,
      msisdn: req.body.msisdn,
      email: req.body.email,
      password: hash,
      emailVerify: false
    });

    let emailHash = encrypt(req.body.email);
    client.set(emailHash, req.body.email, 'EX', 1800);

    res.status(201).send({
      email: req.body.email,
      hash: emailHash
    });
  });
});

app.post("/login", (req, res) => {
  let isPresent = false;
  let email = req.body.email;
  let password = req.body.password;

  if (!checkEmailAddress(email)) {
    return res.status(400).send({
      message: "Invalid Email Address"
    });
  }

  if (password.length < 6) {
    return res.status(400).send({
      message: "Invalid Password"
    });
  }
  mockData.map((record, index) => {
    if (record.email == email) {
      isPresent = true;
      bcrypt.compare(password, record.password, (err, isValid) => {
        if (isValid) {
          if (record.emailVerify) {
            return res.status(200).send({
              message: "Successfully Logged in"
            });
          } else {

            return res.status(401).send({
              message: "Please Verify your email"
            });
          }
        } else {

          return res.status(401).send({
            message: "Invalid credentials"
          });
        }
      });
    }
  });

  if (!isPresent) {

    return res.status(401).send({
      message: "Invalid credentials"
    });
  }
});

app.get('/verify/:hash', (req, res) => {
  let hash = req.params.hash;

  client.get(hash, (err, storeEmail) => {
    if (storeEmail) {
      let decryptedEmail = decrypt(hash);
      if (storeEmail == decryptedEmail) {
        mockData = mockData.map(data => {
          if (data.email == decryptedEmail) {
            data.emailVerify = true;
          }
          return data;
        })
        return res.status(200).send({
          message: "Email Verification Completed"
        });
      } else {
        return res.status(400).send({
          message: "Invalid Request"
        });
      }
    } else {
      return res.status(400).send({
        message: "Verification Window Expired"
      });
    }
  });
});

app.post('/resend', (req, res) => {
  let email = req.body.email;
  let token = encrypt(email)
  client.set(token, email, 'EX', 1800);
  res.status(201).send({
    email: email,
    hash: token
  });
});

function checkEmailAddress(email) {
  let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
}

function encrypt(text) {
  var cipher = crypto.createCipher('aes-256-cbc', secret);
  var crypted = cipher.update(text, 'utf8', 'hex');
  crypted += cipher.final('hex');
  return crypted;
}

function decrypt(text) {
  var decipher = crypto.createDecipher('aes-256-cbc', secret);
  var dec = decipher.update(text, 'hex', 'utf8');
  dec += decipher.final('utf8');
  return dec;
}


app.listen(4000, () => {
  console.log(`Env : ${NODE_ENV}`);
  console.log(`Port : ${4000}`);
});

module.exports = app;