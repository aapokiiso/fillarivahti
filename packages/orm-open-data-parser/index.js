/**
 * This script reads in raw bike station availability data in CSV format,
 * parses it, and writes it out to a new file in a format compatible with the
 * Fillarivahti ORM.
 *
 * @see https://data.markuskainu.fi/opendata/kaupunkipyorat/ Source of bike
 * station availability data.
 */

const fs = require('fs');
const path = require('path');
const csv = require('fast-csv');

// TODO: Read paths from env configuration or options.

const readPath = path.resolve(__dirname, 'data_2021.csv');
const writePath = path.resolve(__dirname, 'data_2021_parsed.csv');

/**
 * Bike station data does not readily contain the capacity of bike stations,
 * ie. how many bike spaces the station has in total.
 *
 * Instead, the data contains information about how many spaces the station
 * has available, and conversely how many bikes are available.
 *
 * Iterate over the dataset to find a data point where the station was empty
 * (bikesAvailable = 0), and read the capacity as the number of available
 * spaces at that point.
 */

const capacities = {};

const capacityRead = fs.createReadStream(readPath)
    .pipe(csv.parse({ headers: true, delimiter: ';' }))
    .transform(data => ({
        stationId: data.id,
        capacity: data.spacesAvailable,
        bikesAvailable: data.bikesAvailable,
    }))
    .validate(data => data.bikesAvailable === '0')
    .on('error', error => console.error(error))
    .on('data', row => {
        const current = capacities[row.stationId] || 0;

        if (row.capacity > current) {
            capacities[row.stationId] = row.capacity;
        }
    });

/**
 * Once capacities are read, rows are iterated once more, parsed to the
 * required format and written to a new CSV file which can then be imported to
 * a database, for example.
 */

capacityRead.on('end', rowCount => {
    console.log(`Read ${rowCount} rows for capacity data (1/2)`);

    const writeStream = fs.createWriteStream(writePath);

    fs.createReadStream(readPath)
        .pipe(csv.parse({ headers: true, delimiter: ';' }))
        .transform(data => {
            const stationId = data.id;
            const capacity = capacities[stationId];

            return {
                stationId,
                timestamp: data.time,
                capacity: capacity ? data.bikesAvailable / capacity : 0,
            };
        })
        .pipe(csv.format())
        .pipe(writeStream)
        .on('error', error => console.error(error))
        .on('end', rowCount => console.log(`Read and parsed ${rowCount} rows (2/2)`));
});
