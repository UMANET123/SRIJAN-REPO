# Wakanda Consent Webapp for Globe Subscribers

This repo deals with providing Consents to the Subscribers in Globe.

### Prerequisites

```
GIT
Docker
```

Please see [the Docker installation
documentation](https://docs.docker.com/installation/) for details on how to
upgrade your Docker daemon.

### Installing

These instructions will get you a copy of the project up and running on your local machine for development and testing purposes.

1. git clone https://github.com/srijanaravali/GlobeWakanda-Microservices.git
2. cd GlobeWakanda-Microservices/src/webapps/consent_app
3. Create a .env file and paste the following content:
    ```shell
    ENV_CLIENT_ID=8J15NvgiMz1oZZddQiQMhxyZRey65lGH
    ENV_SECRET=YqFqdh0PCi4g109p2Rx20FcNrnUb8GEAw78D4PLZungpbjqKkIWDdGZVSTcUWlZA
    ENV_APIGEE_BASE_URL=https://globeslingshot-dev-labs.apigee.net
    ```
4. docker-compose build
5. docker-compose up

The webapp will start running on localhost:5560


## How do I contribute?

Easy! Pull requests are welcome! Just do the following:

   * Create a feature branch (e.g. `git checkout -b my_new_feature`)
   * Make your changes and commit them with a reasonable commit message
   * Make sure the code passes our standards

## Pull Request Process

1. Ensure any install or build dependencies are removed before the end of the layer when doing a build.
2. Update the README.md with details of changes to the interface, this includes new environment variables, exposed ports, useful file locations and container parameters.
3. When contributing to this repository, please first discuss the change you wish to make via issue, email, or any other method with the developers of this repository, before raising the Pull Request once you have the sign-off of other developers, you may request the reviewer to merge it for you.

## Authors

* **Srijan Technologies** - (https://github.com/srijanaravali/GlobeWakanda-Microservices/tree/develop/src/webapps/consent_app)

See also the list of [contributors](https://github.com/srijanaravali/GlobeWakanda-Microservices/graphs/contributors) who participated in this project.

## License

This project is licensed under the ISC License

