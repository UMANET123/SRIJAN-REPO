const express = require("express");
const bodyParser = require("body-parser");
const crypto = require('crypto');
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const redis = require('redis');

const client = redis.createClient('redis://emailtokens');
const app = express();

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

      client.set(req.body.email, token, 'EX', 1800);

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
              message: "Please Verify your email"
            });
          }
        } else {
          return res.status(401).send({
            message: "Invalid credentials"
          });
        }
      })
    }
  })

  if (!isPresent) {
    return res.status(401).send({
      message: "Invalid credentials"
    });
  }
});

app.post('/verify', (req, res) => {
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

app.post('/regenerate', (req, res) => {
  let email = req.body.email;
  crypto.randomBytes(48, function (err, buffer) {
    var token = buffer.toString('hex');

    client.set(email, token, 'EX', 1800);
    
    res.status(201).send({
      email: email,
      hash: token
    });
  });
});

function checkEmailAddress(email) {
  let pattern = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return pattern.test(email);
}

app.listen(4000, () => {
  console.log(`Port : ${4000}`);
});