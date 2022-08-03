import express from 'express';
import cors from 'cors';
import { StatusCodes } from 'http-status-codes';
import { container } from 'tsyringe';
import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';
import * as FillarivahtiAvailabilityEstimation from '@aapokiiso/fillarivahti-availability-estimation';
import { StationIdParser } from './interface/StationIdParser';
import { Logger } from 'winston';

const logger = container.resolve<Logger>('FillarivahtiHttpApi.Logger');
const ormConnectionProvider = container.resolve<FillarivahtiOrm.ConnectionProvider>('FillarivahtiOrm.ConnectionProvider');
const capacityProvider = container.resolve<FillarivahtiCapacityRepository.CapacityProvider>('FillarivahtiHttpApi.CacheAwareCapacityProvider');
const capacityRepositoryConfiguration = container.resolve<FillarivahtiCapacityRepository.Configuration>('FillarivahtiCapacityRepository.Configuration');
const availabilityEstimation = container.resolve<FillarivahtiAvailabilityEstimation.AvailabilityEstimation>('FillarivahtiAvailabilityEstimation.AvailabilityEstimation');
const stationIdParser = container.resolve<StationIdParser>('FillarivahtiHttpApi.StationIdParser');

const app = express();

app.use(cors());

app.get('/', async (req, res) => {
    try {
        const conn = await ormConnectionProvider.getConnection();
        await conn.authenticate();

        return res.status(StatusCodes.OK).end();
    } catch (error: any) {
        logger.error('Failed to connect to the database in the healthcheck endpoint.', {
            error: error.message,
            stack: error.stack,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

app.get('/today', async (req, res) => {
    const stationIds = stationIdParser.parse(req.query);

    if (!stationIds.length) {
        return res.status(StatusCodes.OK).json({});
    }

    try {
        const capacities = await capacityProvider.getToday(stationIds);

        return res.status(StatusCodes.OK).json(capacities);
    } catch (error: any) {
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
    } catch (error: any) {
        logger.error('Failed to get capacities for weekday average.', {
            error: error.message,
            stack: error.stack,
            stationIds,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
});

app.get('/estimated', async (req, res) => {
    const stationIds = stationIdParser.parse(req.query);

    if (!stationIds.length) {
        return res.status(StatusCodes.OK).json({});
    }

    try {
        const todayAvailabilities = await capacityProvider.getToday(stationIds);
        const weekdayAverageAvailabilities = await capacityProvider.getWeekdayAverage(stationIds);

        const estimated = stationIds.reduce((acc: Record<string, FillarivahtiCapacityRepository.Capacity[]>, stationId: string) => {
            acc[stationId] = availabilityEstimation.estimate(
                todayAvailabilities[stationId],
                weekdayAverageAvailabilities[stationId],
                { granularityInMinutes: capacityRepositoryConfiguration.getGranularityInMinutes() },
            ) || [];

            return acc;
        }, {});

        return res.status(StatusCodes.OK).json(estimated);
    } catch (error: any) {
        logger.error('Failed to estimate availabilities.', {
            error: error.message,
            stack: error.stack,
            stationIds,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).json({});
    }
});

export default app;
