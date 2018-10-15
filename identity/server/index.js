const express = require("express");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const app = express();
const redis = require('redis');
const client = redis.createClient('redis://emailtokens');

client.on('connect', (err) => {
  console.log("connected to Redis server");
});

app.use(bodyParser.json());
morgan.token("request-body", function (req, res) {
  return JSON.stringify(req.body);
});

app.use(
  morgan(
    ":method :url :status :res[content-length] - :response-time ms - REQUEST :request-body"
  )
);

const saltRounds = 10;
const emailVerifySaltRounds = 15;
let mockData = [];

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
  });
});

app.post("/register", (req, res) => {
  if (!checkEmailAddress(req.body.email)) {
    return res.status(400).send({
      message: "Please Provide a Valid Email address"
    });
  }

  if (!/^639[0-9]{9}$/.test(req.body.msisdn)) {
    return res.status(400).send({
      message: "Please Provide a Valid Philippines Mobile Number"
    });
  }

  if (req.body.password.length < 6) {
    return res.status(400).send({
      message: "Please enter a password of length greater than 6"
    });
  }

  bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
    crypto.randomBytes(48, function (err, buffer) {
      var token = buffer.toString('hex');
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
      client.set(req.body.email, token, 'EX', 1800)
      res.status(201).send({
        email: req.body.email,
        hash: token
      });
    });
  });
});

app.post("/login", (req, res) => {
  let isPresent = false;
  let email = req.body.email;
  let password = req.body.password;

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
              message: "Please Verify your email to continue, if you have not recieved a verficiation email, request for a new one"
            });
          }
        } else {
          return res.status(401).send({
            message: "Incorrect password or email"
          });
        }
      })
    }
  })

  if (!isPresent) {
    return res.status(401).send({
      message: "Incorrect password or email"
    });
  }
});

app.post('/verify*', (req, res) => {
  let email = req.body.email;
  let hash = req.body.hash;
  client.get(email, (err, storedHash) => {
    if (storedHash) {
      if (storedHash == hash) {
        mockData = mockData.map(data => {
          if (data.email == email) {
            data.emailVerify = true;
          }
          return data;
        })
        return res.status(200).send({
          message: "Verification Complete, please login to continue"
        });
      } else {
        return res.status(400).send({
          message: "Malformed Verification"
        });
      }
    } else {
      return res.status(400).send({
        message: "Verification Window Expired, please request for a new verification email "
      });
    }
  })
})

app.post('/regenerate', (req, res) => {
  let email = req.body.email;
  crypto.randomBytes(48, function (err, buffer) {
    var token = buffer.toString('hex');
    client.set(email, token, 'EX', 1800)
    res.status(201).send({
      email: email,
      hash: token
    });
  });
});

function checkEmailAddress(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

app.listen(4000, () => {
  console.log(`Port : ${4000}`);
});