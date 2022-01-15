import { container } from 'tsyringe';
import express from 'express';
import { StatusCodes } from 'http-status-codes';
import { Logger } from 'winston';
import cors from 'cors';
import * as FillarivahtiOrm from '@aapokiiso/fillarivahti-orm';
import * as FillarivahtiHslCapacityProvider from '@aapokiiso/fillarivahti-hsl-capacity-provider';
import * as FillarivahtiCapacityRepository from '@aapokiiso/fillarivahti-capacity-repository';

const ormConnectionProvider = container.resolve<FillarivahtiOrm.ConnectionProvider>('FillarivahtiOrm.ConnectionProvider');
const capacityProvider = container.resolve<FillarivahtiHslCapacityProvider.CapacityProvider>('FillarivahtiHslCapacityProvider.CapacityProvider');
const capacityRepository = container.resolve<FillarivahtiCapacityRepository.CapacityRepository>('FillarivahtiCapacityRepository.CapacityRepository');
const capacityShredder = container.resolve<FillarivahtiCapacityRepository.CapacityShredder>('FillarivahtiCapacityRepository.CapacityShredder');
const logger = container.resolve<Logger>('FillarivahtiRecorderHttpApi.Logger');

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

app.post('/record', async (req, res) => {
    logger.info('Fillarivahti recorder recording is run.');

    try {
        const capacities = await capacityProvider.getCapacities();

        await capacityRepository.createMany(capacities);

        logger.info('Fillarivahti recorder recording is completed.');

        return res.status(StatusCodes.OK).end();
    } catch (error: any) {
        logger.error('Failed to record bike station capacities.', {
            error: error.message,
            stack: error.stack,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

app.post('/shred', async (req, res) => {
    logger.info('Fillarivahti recorder shredding is run.');

    // TODO: move to configuration
    // Capacity records are retained for 5 full weeks (5 * 7 = 35), ie. the
    // current week and 4 weeks prior.
    const olderThanDays = 35;

    try {
        await capacityShredder.shredByAge(olderThanDays);

        logger.info('Fillarivahti recorder shredding is completed.');

        return res.status(StatusCodes.OK).end();
    } catch (error: any) {
        logger.error('Failed to shred old bike station capacities.', {
            error: error.message,
            stack: error.stack,
        });

        return res.status(StatusCodes.INTERNAL_SERVER_ERROR).end();
    }
});

export default app;
