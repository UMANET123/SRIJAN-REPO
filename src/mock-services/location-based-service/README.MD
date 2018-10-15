# Location Based Service

## Index

- [Introduction](#introduction)
- [Dependencies](#dependencies)
- [Handlers](#handlers)
- [Validations](#validations)
- [Development, Testing and Production Guide](#development,-testing-and-production-guide)

## Introduction

Location Based API Mock server.

This accepts a SOAP contract ( Mentioned in the wsdl file ) and returns a SOAP Contract

## Dependencies

- Express
- XML parser
- Morgan

## Handlers

- Location Management

Provides location data based on SOAP contract received

URL

```http
POST /locationManagement/monetization
```

Request

```xml
<soap:Envelope xmlns:soap="http://www.w3.org/2003/05/soap-envelope" xmlns:loc="http://www.globe.com/warcraft/wsdl/locationmgt/">
   <soap:Header/>
   <soap:Body>
      <loc:GetLocationByMSISDN>
         <!--Optional:-->
         <CSP_Txid>127917398719237</CSP_Txid>
         <!--Optional:-->
         <CP_Id>10</CP_Id>
         <!--Optional:-->
         <CP_UserId>123</CP_UserId>
         <!--Optional:-->
         <CP_Password>akshdkahdk</CP_Password>
         <!--Optional:-->
         <ServiceId>12312313</ServiceId>
         <!--Optional:-->
         <ProductId>1243143</ProductId>
         <MSISDN>639211567891</MSISDN>
      </loc:GetLocationByMSISDN>
   </soap:Body>
</soap:Envelope>
```

Response 200

```xml
<soap:Envelope
    xmlns:soap="http://www.w3.org/2003/05/soap-envelope"
    xmlns:head="http://www.globe.com/warcraft/wsdl/header/"
    xmlns:loc="http://www.globe.com/warcraft/wsdl/locationmgt/">
    <soap:Header>
        <head:WarcraftHeader>
            <!--Optional:-->
            <EsbMessageID>12345678</EsbMessageID>
            <!--Optional:-->
            <EsbRequestDateTime>1234567890</EsbRequestDateTime>
            <!--Optional:-->
            <EsbResponseDateTime>1538057475441</EsbResponseDateTime>
                            <!--Optional:-->
            <EsbIMLNumber>123456789</EsbIMLNumber>
            <!--Optional:-->
            <EsbOperationName>1234567890</EsbOperationName>
        </head:WarcraftHeader>
    </soap:Header>
    <soap:Body>
        <loc:GetLocationByMSISDNResponse>
            <!--Optional:-->
            <GetLocationByMSISDNResult>
            <!--Optional:-->
            <MSISDN>639211567891</MSISDN>
            <!--Optional:-->
            <Latitude>1234567890</Latitude>
            <!--Optional:-->
            <Longitude>1234567890</Longitude>
            </GetLocationByMSISDNResult>
        </loc:GetLocationByMSISDNResponse>
    </soap:Body>
</soap:Envelope>
```

## Validations

The following validations are performed on each request

- Check if number belongs to the Philippines, else return status `400`

```javascript
{
  error: "MSISDN Invalid, does not belong to the Philippines";
}
```

- Check if SOAP contract is present else return status `400`

```text
"SOAP contract not present"
```

- Check if request is POST , else return status `405` with message

```text
"Method Not Allowed"
```

## Development, Testing and Production Guide

The repository has been setup for 3 Environments

- Develop
- Testing
- Staging/Production

Each of these environments have the same build process but different run instructions

### Build

```bash
$ docker-compose build
```

### Develop

Run Services

```bash
$ docker-compose up
```

Stop Services

```bash
$ docker-compose down
```

### Testing

Run Services

```bash
$ docker-compose -f docker-compose.yml -f testing-docker-compose.yml up
```

Stop Services

```bash
$ docker-compose down
```

### Staging/Production

Run Services

```bash
$ docker-compose up -f docker-compose.yml -f production-docker-compose.yml up -d
```

Stop Services

```bash
$ docker-compose down
```

---

NOTE: Please make sure to have the following installed

- Docker
- Docker Compose
