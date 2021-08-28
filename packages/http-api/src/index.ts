import express from 'express';
import { MysqlConnectionProvider } from '@aapokiiso/fillarivahti-orm';
import { OrmCapacityRepository, EnvConfiguration, DefaultAggregateCapacityMapper } from '@aapokiiso/fillarivahti-capacity-repository';
import DefaultStationIdParser from './service/DefaultStationIdParser';
import { StatusCodes } from 'http-status-codes';
import * as winston from 'winston';

if (!process.env.DB_NAME) {
    throw new Error('Database name is missing.');
}

if (!process.env.DB_USER) {
    throw new Error('Database user is missing.');
}

const connectionProvider = new MysqlConnectionProvider(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    process.env.DB_HOST,
    typeof process.env.DB_PORT !== 'undefined' ? Number(process.env.DB_PORT) : undefined,
    process.env.DB_SOCKET_PATH,
    process.env.DB_LOGGING === '1',
);

const capacityRepositoryConfig = new EnvConfiguration();

const capacityRepositoryAggregateCapacityMapper = new DefaultAggregateCapacityMapper(
    capacityRepositoryConfig,
);

const capacityRepository = new OrmCapacityRepository(
    connectionProvider,
    capacityRepositoryConfig,
    capacityRepositoryAggregateCapacityMapper,
);

const stationIdParser = new DefaultStationIdParser();

const logger = winston.createLogger({
    format: winston.format.json(),
    transports: [
        new winston.transports.Console(),
    ],
});

logger.info('Starting Fillarivahti HTTP API');

const app = express();

app.get('/today', async (req, res) => {
    const stationIds = stationIdParser.parse(req.query);

    if (!stationIds.length) {
        return res.status(StatusCodes.OK).json({});
    }

    try {
        const capacities = await capacityRepository.getToday(stationIds);

        return res.status(StatusCodes.OK).json(capacities);
    } catch (error) {
        logger.error('Failed to get capacities for today.', {
            error: error.message,
            stack: error.stack,
            stationIds,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
});

app.get('/weekday-average', async (req, res) => {
    const stationIds = stationIdParser.parse(req.query);

    if (!stationIds.length) {
        return res.status(StatusCodes.OK).json({});
    }

    try {
        const capacities = await capacityRepository.getWeekdayAverage(stationIds);

        return res.status(StatusCodes.OK).json(capacities);
    } catch (error) {
        logger.error('Failed to get capacities for weekday average.', {
            error: error.message,
            stack: error.stack,
            stationIds,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
});

app.listen(process.env.PORT);
