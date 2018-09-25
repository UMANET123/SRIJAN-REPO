# Two Factor Authentication

### Introduction

A Microservice to provide Two Factor Authentication for Globe Telecom numbers.
This service expects a MSISDN ( Mobile Number ) that belongs to the Philippines, and will generate an OTP (Numerical) which is sent over Email/SMS to the registered user.

The OTP has a 30 second Window after which it will expire

### Dependencies

- Express
- Body Parser
- OTLIB

### Handlers

- Generate

Generates an OTP based on the number provided

Note: Make sure the number is from the Philippines

Url
```http
POST /generate
```

Request
```json
{
    msisdn : '639234567891', // Mobile number
}
```

Response 200
```json
{
    msisdn : '639234567891', // Mobile Number
    otp: '1234' // OTP generated
}
```

Response 400
```json
{
    error: "MSISDN Invalid, does not belong to the Philippines"
}
```

- Verify

Verifies an OTP which was generated from the step above

URL
```http
    POST /verify
```

Request
```json
{
    msisdn: '639234567891', // Mobile Number
    otp: '1234' // OTP to verify
}
```

Response 200
```json
{
    msisdn: '639234567891' // Mobile Number
    otp: '1234', // OTP that was verified
    verified: true // Verification status
}
```
Response 400
```json
{
    error: "The OTP has expired, please request for a new one"
}
```


NOTE:
Please note that , if number (msisdn) provided is not from the Philippines, the response will be 400