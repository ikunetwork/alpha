# alpha.iku.network

[![Greenkeeper badge](https://badges.greenkeeper.io/brunobar79/alpha.iku.network.svg?token=f28840b511ac81f05347597ff80013b714b5fbc1806facc4d076c94f61d7798d&ts=1523510090430)](https://greenkeeper.io/)

[![Waffle.io - Columns and their card count](https://badge.waffle.io/e9e274b4be7ea5c12ccb3f5d193f8f5ba12e11f7334a878ae9b9189a5c43dc08.svg?columns=all)](https://waffle.io/brunobar79/alpha.iku.network)

[![CircleCI](https://circleci.com/gh/brunobar79/alpha.iku.network.svg?style=svg&circle-token=aeac950a2a273454f2a601e41a408b27798c9f4f)](https://circleci.com/gh/brunobar79/alpha.iku.network)

dApp for iku.network

## Instructions for running this project:

1. Install project dependencies
```sh
yarn install
```
2. Launch truffle 
```sh
yarn truffle-develop
```
3. Deploy contracts 
```sh
deploy
```
4. You need to connect to a PGSQL server and set the environment variable DATABASE_URL

5. Run the following scripts to setup your database structure
```sh
yarn db::setup
```
6. Run the following scripts to populate the db with some test data.
```sh
yarn db::populate
```
7. On another terminal instance launch the project (FE and BE)
```sh
yarn start
```

## Instructions for running the tests:

```sh
yarn test
```

## Instructions for checking the test coverage:

```sh
yarn test-coverage
```

## License

All code and designs are open sourced under GPL V3.
