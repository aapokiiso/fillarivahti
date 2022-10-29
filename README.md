Fillarivahti
=====

[![lerna](https://img.shields.io/badge/maintained%20with-lerna-cc00ff.svg)](https://lerna.js.org/)
[![gcp](https://img.shields.io/badge/deployed%20on-gcp%20app%20engine-1a73e8.svg)](https://cloud.google.com/appengine/)

[Fillarivahti](https://fillarivahti.fi/) is a city bike availability service
for the Helsinki region. It monitors the number of bikes on city bike stations
in the background, and provides a web interface for quickly checking nearby
bike stations' availabilities.

| --- | :---: | :---: |
List of bike stations | ![List view](/../assets/screenshots/list-view.png | width=100) | |
Bike station view | ![Välimerenkatu bike station view](/../assets/screenshots/station-view-valimerenkatu.png | width=100) | ![Central railway station west-side bike station view](/../assets/screenshots/station-view-central-railway-station-west.png | width=100) |
Map view with user location | ![Map view](/../assets/screenshots/map-view.png | width=100) | |

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

:construction: This section is incomplete! :construction:

To install dependencies, run

```shell
$ npx lerna bootstrap --hoist
```

To lint code style, run

```shell
$ npx lerna run lint
```
