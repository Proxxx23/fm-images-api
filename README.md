<p align="center">
  <a href="http://nestjs.com/" target="blank"><img src="https://nestjs.com/img/logo-small.svg" width="200" alt="Nest Logo" /></a>
</p>

[circleci-image]: https://img.shields.io/circleci/build/github/nestjs/nest/master?token=abc123def456
[circleci-url]: https://circleci.com/gh/nestjs/nest

  <p align="center">A progressive <a href="http://nodejs.org" target="_blank">Node.js</a> framework for building efficient and scalable server-side applications.</p>
    <p align="center">

# Running via Docker

1. Download and install [Docker](https://docs.docker.com/get-docker/)
2. Build an image:
```bash
$ docker build . -t techtask/imagesapi
```
3. Start container:
```bash
$ docker run -p 3000:3000 -d techtask/imagesapi 
```

**App will run on: http://127.0.0.1/3000**

# Running via Node.js Toolchain

## Installation

First, install Node.js on your machine: [How to install Node.js on MacOS](https://nodejs.org/tr/download/package-manager/#macos)

```bash
$ npm install
```

## Running app

```bash
$ npm run start:prod
```

**App will run on: http://127.0.0.1/3000**

## Running tests

Right now there are only e2e endpoint tests.

```bash
$ npm run test
```

## API Documentation

After booting up server you may find documentation [here](http://127.0.0.1:3000/doc)
