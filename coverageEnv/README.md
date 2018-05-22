# alpha.iku.network

[![Greenkeeper badge](https://badges.greenkeeper.io/ikunetwork/alpha.svg?token=f28840b511ac81f05347597ff80013b714b5fbc1806facc4d076c94f61d7798d&ts=1523510090430)](https://greenkeeper.io/)

[![CircleCI](https://circleci.com/gh/ikunetwork/alpha.svg?style=svg&circle-token=0a839ed86374168a52bf662a9e9d254c981e16d4)](https://circleci.com/gh/ikunetwork/alpha)

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
