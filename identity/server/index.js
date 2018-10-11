const express = require("express");
const bodyParser = require("body-parser");
const passport = require("passport");
const bcrypt = require("bcrypt");
const morgan = require("morgan");
const app = express();

app.use(bodyParser.json());
morgan.token("request-body", function(req, res) {
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
    password: hash
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

  if (!req.body.password.length < 6) {
    return res.status(400).send({
      message: "Please enter a password of length greater than 6"
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
      password: hash
    });
    res.status(201).send({
      message: "Account Created"
    });
  });
});

app.post("/login", (req, res) => {
  let isPresent = false;
  for (i = 0; i < mockData.length; i++) {
    if (mockData[i].email == req.body.email) {
      isPresent = true;
      bcrypt.compare(
        req.body.password,
        mockData[i].password,
        (err, isValid) => {
          if (isValid) {
            console.log("Successfully Logged in");
            return res.status(200).send({
              message: "Successfully Logged in"
            });
          } else {
            console.log("Invalid Password");
            return res.status(401).send({
              message: "Incorrect password or email"
            });
          }
        }
      );
    }
  }

  if (!isPresent) {
    console.log("Invalid Password and Email");
    return res.status(401).send({
      message: "Incorrect password or email"
    });
  }
});

function checkEmailAddress(email) {
  let re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(email);
}

app.listen(4000, () => {
  console.log(`Port : ${4000}`);
});
