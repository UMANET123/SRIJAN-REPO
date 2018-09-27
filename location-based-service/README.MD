# Location Based Service

## Introduction

Location Based API Mock server.

This accepts a SOAP contract ( Mentioned in the wsdl file ) and returns a SOAP Contract

## Setup And Build Guide

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