# FriendZone

> FriendZone is an app that matches people who share common interests. It uses cutting edge testing algorithms to optimize user experience and provides them with a select list of their best matches. Users are also able to easily communicate with their matches through in-app services. The app aims to create a simple yet effective user interface that is intuitive and aesthetically pleasing.

## Team

  - [Cody](https://github.com/cody-unger)
  - [Kelly](https://github.com/whithang)
  - [Martin](https://github.com/mkchang)

## Table of Contents

1. [Usage](#Usage)
1. [Requirements](#requirements)
1. [Development](#development)
    1. [Installing Dependencies](#installing-dependencies)
    1. [Tasks](#tasks)
1. [Roadmap](#roadmap)
1. [Contributing](#contributing)

## Usage

### App
https://friendzone-2.herokuapp.com/

## Requirements

- Node 6.4.x
- Express 4.15.0
- React 15.4.2
- ReactDOM 5.4.2
- jQuery 3.1.1
- Mongoose 4.8.6
- Body parser 1.17.2

## Development

### Installing Dependencies

From within the root directory:

```sh
npm install
```

### Obtaining required config information

For local development, configuration files are required:
`server/config/session.config.js` and `server/config/twitter.config.js`
Use the example files to fill in the necessary information. A Twitter account is required to [register a Twitter App](https://apps.twitter.com/app/new).

### Database data
Database data is populated on-load when you start the server
This is executed in database-mongo/index.js
If you don't want the database to be dropped and reloaded with the test data,
then comment out the last group of code

### Running a local server

1. In one terminal window, run `npm run react-dev` to launch webpack
1. In a different terminal window, launch your local MongoDB server (usually `mongod`)
1. In a different terminal window, run `npm run server-dev` to launch the server, go to http://127.0.0.1:8080/ or http://localhost:8080/ to view the app

### Testing

Tests are done with [Jest](https://facebook.github.io/jest) and [Enzyme](http://airbnb.io/enzyme/index.html). Other packages used:
- [supertest](https://www.npmjs.com/package/supertest)
- [React Test Utilities](https://facebook.github.io/react/docs/test-utils.html)

Run tests in repo root folder with
```sh
npm test
```

Test results will be displayed in a browser at http://127.0.0.1:8081/.

Tests are named as `<module/stack tested>Spec.js`.

## Deployment

Deployment for this app was done on [Heroku](https://www.heroku.com).

Provision a MongoDB addon for each app in your pipeline (mLab was used for this app).

Config variables will have to be set that match the `*.config.js` files listed under [Installing Dependencies](#installing-dependencies).

### Roadmap

View the project roadmap on Trello [here](https://trello.com/b/yYWfCOE8/friendzone-2).

## Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.
