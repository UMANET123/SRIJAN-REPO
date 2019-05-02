# Globe Subscriber Dashboard Webapp

This webapp deals with showing all the cosents that a subscriber has given. This app can be used for blocking and revoking consents of subscriber by Globe.

### Prerequisites

```
Docker
```

Please see [the Docker installation
documentation](https://docs.docker.com/installation/) for details on how to
upgrade your Docker daemon.

### Installing

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. git clone https://github.com/srijanaravali/GlobeWakanda-Microservices.git
2. cd GlobeWakanda-Microservices/src/webapps/consent_app
3. Create a .env file and paste the following content:-
    ```shell
    CLIENT_ID=LDHb651rcK9iktEGXYbG0b4a4G4hXq3Q
    SECRET=oUoGoHDGhy1zjl6Z
    APIGEE_BASE_URL=https://globeslingshot-dev-labs.apigee.net
    SESSION_IDLE_TIME=15
    ```
4. docker-compose build
5. docker-compose up

The webapp will start running on localhost:5561

## How do I contribute?

Easy! Pull requests are welcome! Just do the following:

   * Create a feature branch (e.g. `git checkout -b my_new_feature`)
   * Make your changes and commit them with a reasonable commit message
   * Make sure the code passes our standards

## Authors

* **Srijan Technologies** - (https://github.com/srijanaravali/GlobeWakanda-Microservices/tree/develop/src/webapps/consent_app)

See also the list of [contributors](https://github.com/srijanaravali/GlobeWakanda-Microservices/graphs/contributors) who participated in this project.

## License

This project is licensed under the ISC License

