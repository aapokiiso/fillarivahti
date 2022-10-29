Fillarivahti
=====

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![gcp](https://img.shields.io/badge/deployed%20on-gcp%20app%20engine-1a73e8.svg)](https://cloud.google.com/appengine/)

[Fillarivahti](https://fillarivahti.fi/) is a city bike availability service
for the Helsinki region. It monitors the number of bikes on city bike stations
in the background, and provides a web interface for quickly checking nearby
bike stations' availabilities.

| List of nearby bike stations | Map view with user location |
| :---: | :---: |
![List view](/../assets/screenshots/list-view.png) | ![Map view](/../assets/screenshots/map-view.png) |

| Popular bike station in the city center | Nearby bike station trending down |
| :---: | :---: |
| ![Central railway station west-side bike station view](/../assets/screenshots/station-view-central-railway-station-west.png) | ![Välimerenkatu bike station view](/../assets/screenshots/station-view-valimerenkatu.png) |

The service also provides a rough availability forecast for the next 30 minutes
for each bike station based on the last hour's trend and previous weeks' trends.
Don't trust it too much, I don't know what I'm doing :)

Uses the great [Digitransit / HSL Routing API](https://digitransit.fi/en/developers/apis/1-routing-api/bicycling/)
for bike data. Bike availabilities are recorded every 5 minutes.

[Historical bike station data](https://data.markuskainu.fi/opendata/kaupunkipyorat/)
collected by Markus Kainu was used during testing. But at the moment the
service tracks only the current week and the last four weeks for performance
reasons. Hopefully in the future more historical data could be included in the
forecast.

Development
---

### Dependencies

Make sure you're using at least Node.js 16 (required to run the Nuxt 3 frontend).

To install dependencies, run

```shell
$ npx lerna bootstrap --hoist --no-private
```

### Bike stations availability recorder HTTP API

To start a local instance of MySQL for tracking bike stations and a Redis server for caching them, run

```shell
$ docker-compose up -d
```

To start the bike station recorder HTTP API, run

```shell
$ cd packages/recorder-http-api
$ npm run build
# These weak credentials are only meant to be used in local development!
$ PORT=8081 DB_HOST=0.0.0.0 DB_PORT=<mysql-docker-container-exposed-port> DB_NAME=fillarivahti DB_USER=fillarivahti DB_PASSWORD=fillarivahti npm run start
```

Configure a scheduled job to trigger the recorder every 5 minutes. This can be done for example via a local `crontab`.

```shell
*/5 * * * * curl -s -X POST http://localhost:8081/record
```

### Bike stations availability provider HTTP API

To serve bike stations availability recorded by the recorder HTTP API to any frontend application, run

```shell
$ cd packages/http-api
$ npm run build
# These weak credentials are only meant to be used in local development!
$ PORT=8080 DB_HOST=0.0.0.0 DB_PORT=<mysql-docker-container-exposed-port> DB_NAME=fillarivahti DB_USER=fillarivahti DB_PASSWORD=fillarivahti REDIS_HOST=0.0.0.0 REDIS_PORT=<redis-docker-container-exposed-port> npm run start
```

### Web frontend

To start the web frontend locally using the local HTTP API, run

```shell
$ cd packages/web-frontend-nuxt3
# Frontend dependencies are not hoisted via Lerna due to some conflicting packages
$ npm install
$ NUXT_AVAILABILITY_ENDPOINT_URL=http://localhost:8080/ npm run dev
```

### Miscellaneous

#### Code style checks

To lint code style, run

```shell
$ npx lerna run lint
```
