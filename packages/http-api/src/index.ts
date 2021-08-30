import express from 'express';
import { MysqlConnectionProvider, EnvConfiguration as OrmConfiguration } from '@aapokiiso/fillarivahti-orm';
import { OrmCapacityProvider, EnvConfiguration as CapacityRepositoryConfiguration, DefaultAggregateCapacityMapper } from '@aapokiiso/fillarivahti-capacity-repository';
import DefaultStationIdParser from './service/DefaultStationIdParser';
import { StatusCodes } from 'http-status-codes';
import * as winston from 'winston';
import cors from 'cors';

const ormConfiguration = new OrmConfiguration();

const connectionProvider = new MysqlConnectionProvider(
    ormConfiguration,
);

const capacityRepositoryConfiguration = new CapacityRepositoryConfiguration();

const capacityRepositoryAggregateCapacityMapper = new DefaultAggregateCapacityMapper(
    capacityRepositoryConfiguration,
);

const capacityProvider = new OrmCapacityProvider(
    connectionProvider,
    capacityRepositoryConfiguration,
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

app.use(cors());

app.get('/today', async (req, res) => {
    const stationIds = stationIdParser.parse(req.query);

    if (!stationIds.length) {
        return res.status(StatusCodes.OK).json({});
    }

    try {
        const capacities = await capacityProvider.getToday(stationIds);

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
        const capacities = await capacityProvider.getWeekdayAverage(stationIds);

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
